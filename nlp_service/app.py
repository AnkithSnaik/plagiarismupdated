from flask import Flask, jsonify
from flask_pymongo import PyMongo
from bson import ObjectId, errors as bson_errors
from io import BytesIO
from pdfminer.high_level import extract_text
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from gridfs import GridFS
from flask_cors import CORS
import os
import re

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/minorProject")
mongo = PyMongo(app)

SECTION_HEADERS = ["abstract", "introduction", "requirements", "methodology", "implementation", "results", "conclusion"]
bert_model = SentenceTransformer('all-MiniLM-L6-v2')  # BERT model

def extract_pdf_text(file_bytes):
    try:
        with BytesIO(file_bytes) as pdf_stream:
            text = extract_text(pdf_stream)
        return text or ""
    except Exception as e:
        print(f"PDF extraction failed: {e}")
        return ""

def get_file_buffer(file_id):
    fs = GridFS(mongo.db, collection="fileupload")
    file = fs.get(ObjectId(file_id))
    return file.read()

def extract_sections(text):
    sections = {header: "" for header in SECTION_HEADERS}
    text = text.lower()
    for i, header in enumerate(SECTION_HEADERS):
        pattern = rf"{header}[:\n]"
        matches = list(re.finditer(pattern, text))
        if matches:
            start = matches[0].end()
            end = len(text)
            if i + 1 < len(SECTION_HEADERS):
                next_match = re.search(rf"{SECTION_HEADERS[i+1]}[:\n]", text[start:])
                if next_match:
                    end = start + next_match.start()
            sections[header] = text[start:end].strip()
    return sections

def calculate_combined_similarity(text1, text2):
    # TF-IDF
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf_vectorizer.fit_transform([text1, text2])
    tfidf_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

    # BERT
    bert_embeddings = bert_model.encode([text1, text2])
    bert_score = cosine_similarity([bert_embeddings[0]], [bert_embeddings[1]])[0][0]

    # Average the scores
    final_score = (tfidf_score + bert_score) / 2
    return round(final_score * 100, 2)  # Return as percentage

@app.route('/nlp-check/<file_id>', methods=['GET'])
def nlp_check(file_id):
    try:
        try:
            oid = ObjectId(file_id)
        except bson_errors.InvalidId:
            return jsonify({"error": "Invalid file ID"}), 400

        target_doc = mongo.db["fileupload.files"].find_one({"_id": oid})
        if not target_doc or target_doc.get("contentType") != "application/pdf":
            return jsonify({"error": "File not found or not a PDF"}), 404

        target_bytes = get_file_buffer(file_id)
        target_text = extract_pdf_text(target_bytes)
        target_sections = extract_sections(target_text)

        all_files = list(mongo.db["fileupload.files"].find({"contentType": "application/pdf"}))
        detailed_results = []
        similarity_sum = 0
        comparisons = 0

        for other in all_files:
            fid = str(other["_id"])
            if fid == file_id:
                continue
            try:
                other_bytes = get_file_buffer(fid)
                other_text = extract_pdf_text(other_bytes)
                other_sections = extract_sections(other_text)

                for section in SECTION_HEADERS:
                    t_text = target_sections.get(section, "")
                    o_text = other_sections.get(section, "")
                    if t_text.strip() and o_text.strip():
                        score = calculate_combined_similarity(t_text, o_text)
                        similarity_sum += score
                        comparisons += 1
                        detailed_results.append({
                            "section": section,
                            "fileId": fid,
                            "similarity_score": score,
                            "result": "High similarity" if score >= 80 else "Low similarity"
                        })
            except Exception as e:
                print(f"Skipping file {fid} due to error: {e}")
                continue

        avg_similarity_score = round(similarity_sum / comparisons, 2) if comparisons else 0
        avg_similarity_score = min(avg_similarity_score, 100)
        plagiarised = avg_similarity_score >= 80

        if plagiarised:
            fs = GridFS(mongo.db, collection="fileupload")
            try:
                fs.delete(ObjectId(file_id))
            except Exception as e:
                print(f"Failed to delete plagiarised file: {e}")

        return jsonify({
            "avg_similarity_score": float(avg_similarity_score),
            "plagiarised": bool(plagiarised),
            "detailedResults": detailed_results,
            "message": "File plagiarised and deleted" if plagiarised else "No significant plagiarism"
        })

    except Exception as e:
        print(f"Server error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)

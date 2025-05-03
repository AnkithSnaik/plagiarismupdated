// frontend/src/FileUpload.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [teamLeader, setTeamLeader] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [plagiarismResults, setPlagiarismResults] = useState([]);
  const [isPlagiarismChecking, setIsPlagiarismChecking] = useState(false);

  const API = "http://localhost:4002";

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${API}/files`);
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setUploadError("");
    } else {
      alert("Only PDF files are allowed.");
      setFile(null);
      e.target.value = null;
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !teamName || !teamLeader) {
      setUploadError("Please fill all fields and select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("teamName", teamName);
    formData.append("teamLeader", teamLeader);

    try {
      await axios.post(`${API}/upload`, formData);
      setFile(null);
      setTeamName("");
      setTeamLeader("");
      setUploadError("");
      fetchFiles();
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("Upload failed. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.post(`${API}/delete/${id}`);
      if (selectedFileId === id) setSelectedFileId(null);
      fetchFiles();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handlePreview = (id) => {
    window.open(`${API}/pdf/${id}`, "_blank");
  };

  const handlePlagiarismCheck = async () => {
    if (!selectedFileId) return alert("Please select a file to check plagiarism.");

    setIsPlagiarismChecking(true);
    try {
      const res = await axios.get(`${API}/check-plagiarism`, {
        params: { selectedFileId },
      });

      const results = res.data.plagiarismResults || [];

      const enrichedResults = results.map((result) => {
        const fileMeta = files.find((f) => f._id === result.fileId);
        return {
          ...result,
          teamName: fileMeta?.metadata?.teamName || "Unknown Team",
          teamLeader: fileMeta?.metadata?.teamLeader || "Unknown Leader",
        };
      });

      setPlagiarismResults(enrichedResults);
    } catch (err) {
      console.error("Plagiarism check error:", err);
      alert("Error checking plagiarism.");
    } finally {
      setIsPlagiarismChecking(false);
    }
  };

  return (
    <div className="container mx-auto p-5 max-w-2xl">
      <h2 className="text-3xl font-semibold text-center mb-6">PDF Upload</h2>

      {uploadError && <div className="text-red-500 text-center mb-4">{uploadError}</div>}

      <form onSubmit={handleUpload} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Team Name"
          className="w-full p-2 border rounded"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Team Leader"
          className="w-full p-2 border rounded"
          value={teamLeader}
          onChange={(e) => setTeamLeader(e.target.value)}
        />
        <input
          type="file"
          accept="application/pdf"
          className="w-full p-2 border rounded"
          onChange={handleFileChange}
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Upload
        </button>
      </form>

      <button
        onClick={handlePlagiarismCheck}
        disabled={!selectedFileId}
        className={`w-full py-2 rounded text-white ${
          selectedFileId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-400"
        }`}
      >
        {isPlagiarismChecking ? "Checking..." : "Check Plagiarism"}
      </button>

      {plagiarismResults.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Plagiarism Results</h3>
          <ul>
            {plagiarismResults.map((result, idx) => (
              <li key={idx} className="border-b py-2">
                <p>
                  Compared with <b>{result.teamName}</b> (Leader: {result.teamLeader})
                </p>
                <p className="text-red-600">{result.result_message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h3 className="text-xl font-bold mt-8 mb-2">Uploaded Files</h3>
      <ul>
        {files.map((file) => (
          <li key={file._id} className="border-b py-2 flex justify-between items-center">
            <div>
              <p>{file.metadata?.originalname}</p>
              <p className="text-sm text-gray-600">
                Team: {file.metadata?.teamName} | Leader: {file.metadata?.teamLeader}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handlePreview(file._id)} className="bg-green-500 text-white px-2 py-1 rounded">Preview</button>
              <button onClick={() => handleDelete(file._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              <button onClick={() => setSelectedFileId(file._id)} className="bg-gray-600 text-white px-2 py-1 rounded">
                {selectedFileId === file._id ? "Selected" : "Select"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileUpload;

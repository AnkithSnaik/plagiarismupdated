import React from "react";
import "../styles/ResultModal.css";

function ResultModal({ result, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>File {result.plagiarised ? "plagiarised and deleted" : "accepted"}</h3>
        <p><strong>Average Similarity:</strong> {result.avg_similarity_score?.toFixed(2)}%</p>
        <p className={result.plagiarised ? "plagiarised" : "accepted"}>
          {result.plagiarised ? "❌ Plagiarised" : "✅ Accepted"}
        </p>

        {result.detailedResults?.length > 0 && (
          <>
            <h4>Detailed Section Comparison:</h4>
            <table>
              <thead>
                <tr>
                  <th>Compared File ID</th>
                  <th>Section</th>
                  <th>Similarity Score</th>
                </tr>
              </thead>
              <tbody>
                {result.detailedResults.map((item, i) => (
                  <tr key={i}>
                    <td>{item.fileId}</td>
                    <td>{item.section}</td>
                    <td>{item.similarity_score}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default ResultModal;

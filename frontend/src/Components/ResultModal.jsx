// frontend/src/Components/ResultModal.jsx
import React from 'react';

function ResultModal({ result, onClose }) {
  if (!result) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 dark:bg-gray-900 dark:bg-opacity-75">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:text-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Plagiarism Check Results</h2>

        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Uploaded File Details:
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">Team Name:</span> {result.originalTeamName}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">Team Leader:</span> {result.originalTeamLeader}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">Email:</span> {result.originalTeamEmail}
          </p>
        </div>

        <p className={`text-xl font-bold mb-4 ${result.plagiarised ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
          Overall Status: {result.message}
        </p>

        {result.plagiarism_results && result.plagiarism_results.length > 0 && (
          <p className="text-md mb-4 text-gray-700 dark:text-gray-300">
            Average Similarity Score: <span className="font-bold">{result.avg_similarity_score.toFixed(2)}%</span>
          </p>
        )}

        {result.detailedResults && result.detailedResults.length > 0 ? (
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Comparison Details:</h3>
            <div className="space-y-4">
              {result.detailedResults.map((item, index) => (
                <div key={item.comparedFileId || index} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Compared with: <span className="font-bold">{item.comparedFileName}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">({item.comparedTeamName} - {item.comparedTeamLeader})</span>
                  </p>
                  <p className={`text-lg font-bold mt-1 ${item.similarity_score > 70 ? 'text-red-500' : 'text-green-500'}`}>
                    Similarity: {item.similarity_score.toFixed(2)}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Result: {item.result}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
            <p className="text-gray-600 dark:text-gray-400 italic">No detailed plagiarism results available (e.g., no other files to compare, or no significant matches).</p>
        )}

      </div>
    </div>
  );
}

export default ResultModal;
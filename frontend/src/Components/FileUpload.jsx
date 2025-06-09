// frontend/src/Components/FileUpload.jsx
import React, { useState } from "react";
import toast from 'react-hot-toast'; // Import toast for user notifications

function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [plagiarismResults, setPlagiarismResults] = useState(null);
  const [error, setError] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [teamLeader, setTeamLeader] = useState("");
  const [teamEmail, setTeamEmail] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPlagiarismResults(null);
    setError(null); // Clear any previous errors or results when a new file is selected
  };

  const handleUpload = async () => {
    // Input validation with toast notifications
    if (!file) {
      toast.error("Please select a PDF file first.");
      return;
    }
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }
    if (!teamName.trim() || !teamLeader.trim() || !teamEmail.trim()) {
      toast.error("Please fill in Team Name, Team Leader, and Email Address.");
      return;
    }

    setUploading(true);
    setError(null); // Clear any previous error messages on new upload attempt

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("teamName", teamName);
      formData.append("teamLeader", teamLeader);
      formData.append("teamEmail", teamEmail);

      // Send file to Node.js backend
      const uploadResponse = await fetch("http://localhost:4002/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        // Attempt to parse error message from backend if available
        const errorData = await uploadResponse.json().catch(() => uploadResponse.text());
        const errorMessage = typeof errorData === 'object' && errorData.error ? errorData.error : errorData.message || "Unknown error occurred on the server.";
        
        console.error("File upload failed:", uploadResponse.status, errorMessage); // Log for debugging
        toast.error(`Upload failed: ${errorMessage}`); // Display error to user
        throw new Error(errorMessage); // Propagate error for catch block
      }

      const responseData = await uploadResponse.json();
      const uploadedFileId = responseData.fileId;
      // Backend should ideally send plagiarismResults directly or a message
      const plagiarismReport = responseData.plagiarismReport; // Check for nested report

      if (!uploadedFileId) {
        toast.error("Upload successful but no file ID was returned by the server.");
        throw new Error("No file ID returned from upload.");
      }

      // Check for plagiarism results, which might be nested under `plagiarismReport.plagiarism_results`
      let resultsToDisplay = plagiarismReport && plagiarismReport.plagiarism_results
                             ? plagiarismReport.plagiarism_results
                             : responseData.plagiarism_results; // Fallback if not nested

      if (!resultsToDisplay || resultsToDisplay.length === 0) {
          toast.success("File uploaded successfully. No significant plagiarism detected or no other documents to compare against.");
          setPlagiarismResults([]); // Set to empty array to show "No results" message
      } else {
          toast.success("File uploaded and plagiarism check completed!");
          setPlagiarismResults(resultsToDisplay);
      }
      
    } catch (err) {
      console.error("Error during upload or plagiarism check:", err);
      // Ensure error state is set and displayed correctly
      setError(err.message || "An unexpected error occurred.");
      setPlagiarismResults(null); // Clear previous results on error
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8 dark:bg-gray-800 dark:text-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center dark:text-gray-100">PDF Upload & NLP Plagiarism Check</h2>

      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="file-upload" className="block text-gray-700 text-sm font-medium mb-2 dark:text-gray-300">Select PDF File:</label>
          <input
            id="file-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:file:bg-blue-700 dark:file:text-blue-100 dark:hover:file:bg-blue-800"
          />
        </div>

        <div>
          <label htmlFor="team-name" className="block text-gray-700 text-sm font-medium mb-2 dark:text-gray-300">Team Name:</label>
          <input
            id="team-name"
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="e.g., Alpha Team"
            className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        <div>
          <label htmlFor="team-leader" className="block text-gray-700 text-sm font-medium mb-2 dark:text-gray-300">Team Leader:</label>
          <input
            id="team-leader"
            type="text"
            value={teamLeader}
            onChange={(e) => setTeamLeader(e.target.value)}
            placeholder="e.g., John Doe"
            className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        <div>
          <label htmlFor="team-email" className="block text-gray-700 text-sm font-medium mb-2 dark:text-gray-300">Email Address:</label>
          <input
            id="team-email"
            type="email" // Use type="email" for better validation and keyboard on mobile
            value={teamEmail}
            onChange={(e) => setTeamEmail(e.target.value)}
            placeholder="e.g., team@example.com"
            className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading || !file || !teamName.trim() || !teamLeader.trim() || !teamEmail.trim()} // All fields must be filled
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-300 ${
            uploading || !file || !teamName.trim() || !teamLeader.trim() || !teamEmail.trim()
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          }`}
        >
          {uploading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            "Upload and Check Plagiarism"
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mt-4 dark:bg-red-900 dark:text-red-100 dark:border-red-700" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {plagiarismResults && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 dark:text-gray-100">Plagiarism Check Results:</h3>
          {plagiarismResults.length > 0 ? (
            <ul className="divide-y divide-gray-200 bg-gray-50 rounded-lg shadow-inner p-4 dark:bg-gray-700 dark:divide-gray-600">
              {plagiarismResults.map((res, index) => (
                <li key={res.fileId || index} className="py-3 px-2">
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    <span className="text-blue-600 dark:text-blue-300">File:</span> {res.filename || `ID: ${res.fileId}`}
                  </p>
                  <p className="text-gray-700 text-sm dark:text-gray-300">
                    <span className="font-medium">Team:</span> {res.teamName || 'N/A'}, <span className="font-medium">Leader:</span> {res.teamLeader || 'N/A'}, <span className="font-medium">Email:</span> {res.teamEmail || "N/A"}
                  </p>
                  <p className={`text-lg font-semibold ${res.result === "Plagiarized" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                    Similarity: {(res.similarity_score * 100).toFixed(2)}% — {res.result}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mt-4 dark:bg-green-900 dark:text-green-100 dark:border-green-700" role="alert">
              <p className="font-bold">No significant plagiarism detected!</p>
              <p className="text-sm">Or no comparison documents found in the database.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
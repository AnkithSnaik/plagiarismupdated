import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/UploadForm.css";

function UploadForm({ setResult, setPopupVisible }) {
  const [file, setFile] = useState(null);
  const [teamNumber, setTeamNumber] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [duplicateTeamWarning, setDuplicateTeamWarning] = useState("");
  const [duplicateTitleWarning, setDuplicateTitleWarning] = useState("");

  useEffect(() => {
    const checkDuplicates = async () => {
      try {
        if (!teamNumber && !projectTitle) {
          setDuplicateTeamWarning("");
          setDuplicateTitleWarning("");
          return;
        }

        const params = {};
        if (teamNumber) params.teamNumber = teamNumber;
        if (projectTitle) params.projectTitle = projectTitle;

        const response = await axios.get("http://localhost:4002/check-duplicate", { params });

        if (response.data.duplicateTeamNumber) {
          setDuplicateTeamWarning("⚠️ Duplicate team number detected!");
        } else {
          setDuplicateTeamWarning("");
        }

        if (response.data.duplicateProjectTitle) {
          setDuplicateTitleWarning("⚠️ Duplicate project title detected!");
        } else {
          setDuplicateTitleWarning("");
        }
      } catch (error) {
        console.error("Duplicate check failed:", error);
        setDuplicateTeamWarning("");
        setDuplicateTitleWarning("");
      }
    };

    checkDuplicates();
  }, [teamNumber, projectTitle]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (duplicateTeamWarning || duplicateTitleWarning) {
      alert("Please resolve duplicates before uploading.");
      return;
    }

    if (!file || !teamNumber || !projectTitle) {
      alert("Please fill all fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("teamNumber", teamNumber);
    formData.append("projectTitle", projectTitle);

    try {
      const response = await axios.post("http://localhost:4002/upload", formData);
      setResult({
        ...response.data,
        detailedResults: response.data.detailedResults || [],
      });
      setPopupVisible(true);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed or server error.");
    }
  };

  return (
    <div className="upload-form-container">
      <h2>Upload Project for Plagiarism Check</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Team Number"
          value={teamNumber}
          onChange={(e) => setTeamNumber(e.target.value)}
        />
        {duplicateTeamWarning && (
          <p className="error-text">{duplicateTeamWarning}</p>
        )}

        <input
          type="text"
          placeholder="Project Title"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
        />
        {duplicateTitleWarning && (
          <p className="error-text">{duplicateTitleWarning}</p>
        )}

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit" disabled={duplicateTeamWarning || duplicateTitleWarning}>
          Upload & Check
        </button>
      </form>
    </div>
  );
}

export default UploadForm;

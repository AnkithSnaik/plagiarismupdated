import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from './Home/Home';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Hero2 from './Components/hero2';
import { Toaster } from 'react-hot-toast';
import UploadForm from "./components/UploadForm"; // from your original logic
import ResultModal from "./components/ResultModal"; // from your original logic
import './App.css';

function FileUploadPage() {
  const [result, setResult] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  return (
    <div className="app-container">
      <h2>Plagiarism Detection Upload</h2>
      <UploadForm setResult={setResult} setPopupVisible={setPopupVisible} />
      {popupVisible && result && (
        <ResultModal result={result} onClose={() => setPopupVisible(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <div className="dark:bg-slate-900 dark:text-white min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/hero2" element={<Hero2 />} />
        <Route path="/upload" element={<FileUploadPage />} />
        <Route path="/results" element={<div>Results Page Placeholder</div>} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;

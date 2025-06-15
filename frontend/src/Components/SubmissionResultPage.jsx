import React, { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { useAuth } from "../Context/Authprovider.jsx";
import toast from "react-hot-toast";

function SubmissionResultPage() {
  const { authUser } = useAuth();
  const [results, setResults] = useState([]);
  const [expandedTeam, setExpandedTeam] = useState(null);

  const fetchResults = async () => {
    try {
      const res = await fetch("http://localhost:4002/api/plagiarism/result", {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      });
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching results:", error);
      toast.error("Failed to fetch results.");
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchResults();
    }
  }, [authUser]);

  const handleDeleteResult = async (resultId) => {
    try {
      const res = await fetch(`http://localhost:4002/api/plagiarism/result/${resultId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      });
      const data = await res.json();
      toast.success(data.message || "Result deleted");
      fetchResults();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Error deleting result");
    }
  };

  const handleClearTeamSubmissions = async (teamName) => {
    try {
      const res = await fetch(`http://localhost:4002/api/plagiarism/clear/team/${teamName}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      });
      const data = await res.json();
      toast.success(data.message || "Team submissions cleared");
      fetchResults();
    } catch (err) {
      console.error("Clear team error:", err);
      toast.error("Error clearing team submissions");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-white">
      <Navbar user={authUser} />

      <main className="flex-grow p-6 md:p-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-300">
          Team Submissions and Results
        </h2>

        {results.length === 0 ? (
          <p className="text-center text-lg">No results to display.</p>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {results.map((res) => (
              <div
                key={res._id}
                className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow-lg bg-white dark:bg-slate-800"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedTeam(expandedTeam === res._id ? null : res._id)}
                >
                  <div className="text-lg font-semibold">{res.teamName}</div>
                  <div className="text-sm text-gray-500">
                    {expandedTeam === res._id ? "Hide" : "View Details"}
                  </div>
                </div>

                {expandedTeam === res._id && (
                  <div className="mt-4 space-y-2">
                    <p><strong>Team Leader:</strong> {res.teamLeader}</p>
                    <p><strong>Uploaded File:</strong> {res.fileName}</p>
                    <p><strong>Plagiarism Percentage:</strong> {res.percentage}%</p>
                    <p><strong>Details:</strong> {res.resultText}</p>

                    <div className="mt-4 flex gap-4">
                      <button
                        onClick={() => handleDeleteResult(res._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
                      >
                        Delete This Result
                      </button>
                      <button
                        onClick={() => handleClearTeamSubmissions(res.teamName)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm transition"
                      >
                        Clear Entire Team Submissions
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default SubmissionResultPage;

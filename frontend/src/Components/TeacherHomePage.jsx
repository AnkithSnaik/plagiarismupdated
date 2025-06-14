// frontend/src/Components/TeacherHomePage.jsx
import React from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { useAuth } from '../Context/Authprovider.jsx';

function TeacherHomePage() {
  const { authUser } = useAuth(); // Get authenticated user details

  // If authUser is null (not yet loaded), show a loading state
  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-white">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white font-inter">
      {/* Navbar with user info */}
      <Navbar user={authUser} />

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 md:p-12 max-w-2xl w-full text-center border border-gray-200 dark:border-gray-700">
          <h1 className="text-4xl font-extrabold text-blue-700 dark:text-blue-300 mb-4 animate-fade-in-down">
            Welcome, {authUser.username}!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed animate-fade-in-up">
            This is your dedicated Teacher Dashboard. From here, you can manage student submissions,
            review plagiarism reports, and access teaching resources.
          </p>

          <div className="space-y-4 md:space-x-4 md:space-y-0 flex flex-col md:flex-row justify-center">
            <a
              href="/upload"
              className="btn bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Upload Assignment
            </a>
            <a
              href="/teacher-portal"
              className="btn bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
            >
              View Result 
            </a>
          </div>
        </div>
      </main>

      <Footer />

      <style>
        {`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          animation-delay: 0.2s;
        }
        `}
      </style>
    </div>
  );
}

export default TeacherHomePage;

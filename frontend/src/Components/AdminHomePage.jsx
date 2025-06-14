// frontend/src/Components/AdminHomePage.jsx
import React from 'react';
import Navbar from './Navbar.jsx'; // Explicitly added .jsx extension to resolve path
import Footer from './Footer.jsx'; // Explicitly added .jsx extension to resolve path
import { useAuth } from '../Context/Authprovider.jsx'; // Keeping .jsx extension for cross-directory import

function AdminHomePage() {
  const { authUser } = useAuth(); // Get the authenticated user from the AuthContext

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white font-inter">
      {/* Include Navbar for consistent navigation and logout, pass authUser as a prop */}
      <Navbar user={authUser} />

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 md:p-12 max-w-2xl w-full text-center border border-gray-200 dark:border-gray-700">
          <h1 className="text-4xl font-extrabold text-green-700 dark:text-green-300 mb-6 animate-scale-in">
            Welcome, Admin!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed animate-fade-in">
            This is your central administration dashboard. Here you can manage users,
            monitor system activity, and configure application settings.
          </p>
          <div className="space-y-4 md:space-x-4 md:space-y-0 flex flex-col md:flex-row justify-center">
            {/* Example links for admin actions */}
            <a href="/admin-dashboard" className="btn bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105">
              Manage Users
            </a>
            <a href="/settings" className="btn bg-purple-500 text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105">
              App Settings
            </a>
          </div>
        </div>
      </main>

      {/* Include Footer */}
      <Footer />

      {/* Basic CSS for animations */}
      <style>
        {`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scaleIn 0.7s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.7s ease-out forwards;
          animation-delay: 0.3s; /* Delay slightly after title */
        }
        `}
      </style>
    </div>
  );
}

export default AdminHomePage;

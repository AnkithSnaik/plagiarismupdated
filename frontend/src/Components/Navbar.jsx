import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import Login from './Login'; // Assuming Login is designed to be a modal triggered by ID
import { useAuth } from '../Context/Authprovider'; // Import the useAuth hook

const Navbar = () => {
  // Destructure authUser, logout function, and loading state from useAuth hook
  const { authUser, logout, loading } = useAuth(); 
  const navigate = useNavigate(); // Initialize useNavigate for potential redirects
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const element = document.documentElement; // Refers to the <html> element for theme changes

  useEffect(() => {
    // Apply theme changes to the document's root element and body
    if (theme === "dark") {
      element.classList.add("dark");
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  // Function to handle user logout
  const handleLogout = () => {
    // Call the logout function from AuthContext, which handles clearing state and localStorage
    logout();
    // Redirect to home page after logout for a clean state
    navigate("/"); 
    // toast.success("Logged out successfully!"); // Can add a toast message here (ensure toast is imported in App.jsx or Navbar.jsx)
  };

  // Navigation items for the Navbar
  const navitem = (
    <>
      <li><Link to="/">Home</Link></li> {/* Changed <a> to Link */}
      <li><Link to="/anouncement">Anouncement</Link></li> {/* Changed <a> to Link */}
      {/* Changed Dashboard link to /hero2 as that's the dashboard-like page after login */}
      <li><Link to="/#">Dashboard</Link></li> {/* Changed <a> to Link */}
      <li><Link to="/about">About</Link></li> {/* Changed <a> to Link, assuming /about exists */}
    </>
  );

  return (
    <>
      {/* Fixed position for the Navbar */}
      <div className="max-w-screen-2xl container mx-auto md:px-0 px-4 fixed top-0 left-0 right-0 z-50">
        <div className="navbar bg-base-100">
          <div className="navbar-start">
            {/* Dropdown for mobile navigation */}
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              </div>
              <ul tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                {navitem}
              </ul>
            </div>
            {/* Brand/Logo */}
            <Link to="/" className="text-2xl font-bold cursor-pointer no-underline">Plagiarism</Link> {/* Changed <a> to Link */}
          </div>

          <div className="navbar-end space-x-3">
            {/* Desktop navigation menu */}
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1">{navitem}</ul>
            </div>

            {/* Theme Toggle (Sun/Moon Icon) */}
            <label className="swap swap-rotate">
              <input type="checkbox" className="theme-controller" value="synthwave" 
                checked={theme === "dark"}
                onChange={() => setTheme(theme === "light" ? "dark" : "light")}
              />
              <svg className="swap-off h-7 w-7 fill-current"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM17,5.64a1,1,0,0,0-.71-.71,1,1,0,0,0-1.41,0L17,5.64ZM12,20a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V21A1,1,0,0,0,12,20ZM19.36,17a1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.42L18.64,15.64a1,1,0,0,0-1.41,1.41l.71.71A1,1,0,0,0,19.36,17ZM12,7A5,5,0,1,0,17,12,5,5,0,0,0,12,7Zm0,8a3,3,0,1,1,3-3A3,3,0,0,1,12,15Z"/>
              </svg>
              <svg className="swap-on h-7 w-7 fill-current"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8,8,0,0,1-1.63-.91,1,1,0,0,0-1.06.33,1,1,0,0,0,.33,1.06A10,10,0,0,0,12,21.92,1,1,0,0,0,13,22a1,1,0,0,0,0-2h-.08a8,8,0,0,1-5.74-1.92,1,1,0,0,0-1.06-.33,1,1,0,0,0-.33,1.06A10,10,0,0,0,4.08,13a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,13a1,1,0,0,0,.14,1.05A8,8,0,0,1,6.77,15.63a1,1,0,0,0,.33,1.06A10,10,0,0,0,13,19.92a1,1,0,0,0,1,1h.08a8,8,0,0,1,5.74,1.92,1,1,0,0,0,1.06-.33,1,1,0,0,0,.33-1.06A10,10,0,0,0,19.92,13a1,1,0,0,0,1-1h1a1,1,0,0,0,0-2H21.64ZM12,2a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V3A1,1,0,0,0,12,2Zm0,18a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V21A1,1,0,0,0,12,20ZM4,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm16,0a1,1,0,0,0-1-1H19a1,1,0,0,0,0,2h1A1,1,0,0,0,21,12ZM12,7a5,5,0,1,0,5,5A5,5,0,0,0,12,7Zm0,8a3,3,0,1,1,3-3A3,3,0,0,1,12,15Z"/>
              </svg>
            </label>

            {/* Login/Logout Logic */}
            <div>
              {loading ? ( // Show a loading indicator or nothing while checking auth status
                <div className="skeleton h-8 w-20"></div> // Placeholder for loading state
              ) : authUser ? ( // If authUser is true (logged in)
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-sm font-normal text-white px-2 py-1 rounded-md hover:bg-red-700 duration-300"
                >
                  Logout
                </button>
              ) : ( // If authUser is null (logged out)
                <>
                  <a
                    onClick={() => document.getElementById("my_modal_3").showModal()}
                    className="bg-black text-sm font-normal text-white px-2 py-1 rounded-md hover:bg-slate-800 duration-300 cursor-pointer"
                  >
                    Login
                  </a>
                  {/* The Login component (modal) is rendered here. 
                      It will be hidden until showModal() is called. */}
                  <Login /> 
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
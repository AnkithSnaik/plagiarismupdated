import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { LinearGradient } from 'react-text-gradients'; // Assuming this import exists and is correctly installed
import { useAuth } from '../Context/Authprovider';
import toast from 'react-hot-toast';

const Banner = () => {
  // Destructure authUser and loading from the useAuth hook
  const { authUser, loading } = useAuth(); 
  const navigate = useNavigate();

  const handleAnalyze = () => {
    // Prevent action if authentication status is still loading
    if (loading) {
      toast.info("Please wait, checking authentication status...");
      return;
    }

    if (!authUser) { // If authUser is null (not logged in)
      toast.error("Please login first to analyze your proposal.");
      const loginModal = document.getElementById("my_modal_3");
      if (loginModal) {
        loginModal.showModal(); // Open the login modal
      }
    } else {
      // If authUser exists (logged in), navigate to the hero2 page
      navigate("/hero2"); 
    }
  };

  return (
    <div className="hero min-h-screen" style={{ backgroundColor: 'lightblue' }}>
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-3 text-3xl font-bold">
            {/* If LinearGradient is not installed/working, uncomment the line below and remove LinearGradient */}
            {/* Identify Duplicity in Project Proposals */}
            {/* Assuming LinearGradient component is correctly imported and works */}
            {/* <LinearGradient gradient={['to left', '#17acff ,#ff68f0']}> */}
              Identify Duplicity in Project Proposals
            {/* </LinearGradient> */}
          </h1>
          <p className="mb-5">
            Ensure the originality of your project proposals with our advanced duplicity detection tool.
          </p>
          <button 
            className="btn btn-primary" 
            onClick={handleAnalyze}
            disabled={loading} // Optionally disable button while loading auth status
          >
            {loading ? "Loading..." : "Analyze Proposal"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
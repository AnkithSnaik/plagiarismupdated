import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component to wrap your application
export default function AuthProvider({ children }) {
  // State to hold the authenticated user object (e.g., { _id, fullname, email })
  const [authUser, setAuthUser] = useState(null);
  // State to hold the JWT authentication token string
  const [authToken, setAuthToken] = useState(null);
  // State to indicate if the initial authentication status has been loaded from localStorage
  const [loading, setLoading] = useState(true);

  // useEffect to load initial auth state from localStorage when the component mounts
  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem("Users");
      const storedAuthToken = localStorage.getItem("authToken");

      // Parse and set user data if available
      if (storedUserData && storedUserData !== "undefined") {
        try {
          const parsedUser = JSON.parse(storedUserData);
          setAuthUser(parsedUser);
        } catch (error) {
          console.error("AuthProivder: Error parsing user data from localStorage:", error);
          // If parsing fails, clear bad data
          localStorage.removeItem("Users");
          setAuthUser(null);
        }
      } else {
        setAuthUser(null);
      }

      // Set auth token if available
      if (storedAuthToken) {
        setAuthToken(storedAuthToken);
      } else {
        setAuthToken(null);
      }
    } catch (error) {
      console.error("AuthProivder: Error loading auth data from localStorage:", error);
      // In case of any localStorage read errors, clear everything
      localStorage.removeItem("Users");
      localStorage.removeItem("authToken");
      setAuthUser(null);
      setAuthToken(null);
    } finally {
      // Set loading to false once initial state is determined, regardless of success or failure
      setLoading(false);
    }
  }, []); // Empty dependency array means this runs only once on mount

  // Function to handle successful login
  const login = (user, token) => {
    setAuthUser(user);
    setAuthToken(token);
    localStorage.setItem("Users", JSON.stringify(user)); // Store user object
    localStorage.setItem("authToken", token); // Store token string
    console.log("AuthProvider: User logged in, new authUser:", user); // Debug log
  };

  // Function to handle logout
  const logout = () => {
    setAuthUser(null);
    setAuthToken(null);
    localStorage.removeItem("Users"); // Clear user object
    localStorage.removeItem("authToken"); // Clear token string
    console.log("AuthProvider: User logged out."); // Debug log
  };

  // The value object provided to any consumer of the AuthContext
  const contextValue = {
    authUser,      // The authenticated user object (or null)
    authToken,     // The JWT token string (or null)
    loading,       // True if still loading initial state, false otherwise
    login,         // Function to call on successful login
    logout,        // Function to call on logout
  };

  // Render children only after the initial authentication state has been loaded
  // You might show a loading spinner or splash screen here
  if (loading) {
    return <div>Loading authentication status...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to easily consume the AuthContext in any functional component
export const useAuth = () => useContext(AuthContext);
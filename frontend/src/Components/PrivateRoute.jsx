// frontend/src/Components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/Authprovider'; // Removed .jsx extension to see if it resolves the issue
import toast from 'react-hot-toast';

/**
 * PrivateRoute component for protecting routes based on authentication status and user roles.
 *
 * @param {object} props - The component props.
 * @param {Array<string>} [props.allowedRoles] - An optional array of roles that are allowed to access this route.
 * If not provided, only authentication is checked.
 */
const PrivateRoute = ({ allowedRoles }) => {
  // Get the authenticated user object from the AuthContext
  const { authUser } = useAuth();

  // 1. Check if the user is authenticated (logged in)
  if (!authUser) {
    // If not authenticated, show an error message and redirect to the login page.
    toast.error("Please log in to access this page.");
    return <Navigate to="/login" replace />; // 'replace' prop prevents navigating back to the protected route
  }

  // 2. If the user is authenticated, check for role-based access if allowedRoles are specified
  if (allowedRoles && !allowedRoles.includes(authUser.role)) {
    // If allowedRoles are specified and the user's role is not in the allowed list,
    // show an error message and redirect to the home page (or an unauthorized access page).
    toast.error("You do not have permission to access this page.");
    return <Navigate to="/" replace />; // Redirect to a suitable unauthorized page
  }

  // If both authentication and role checks pass, render the child routes
  return <Outlet />;
};

export default PrivateRoute;

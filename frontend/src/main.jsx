// frontend/src/main.jsx
import { StrictMode } from 'react' // Importing StrictMode directly from react
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx' // Assuming App.jsx is in the same directory as main.jsx
import { BrowserRouter } from 'react-router-dom' // Importing BrowserRouter for routing context

// FIX 1: Correctly import AuthProvider as a default import
// (because Authprovider.jsx uses 'export default function AuthProvider')
import AuthProvider from "./Context/Authprovider";

// Get the root DOM element where the React app will be mounted
const rootElement = document.getElementById('root');

// Create a React root
const root = createRoot(rootElement);

// Render the application
root.render(
  <StrictMode>
    {/* FIX 2: Wrap the entire application with BrowserRouter.
        This provides the necessary routing context for all components
        that use React Router (like <Routes>, <Route>, useRoutes(), etc.). */}
    <BrowserRouter>
      {/* AuthProvider wraps App to make authentication context available throughout your app */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

// The commented-out duplicate block has been removed for clarity.
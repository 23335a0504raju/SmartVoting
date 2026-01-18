import React from 'react';
import { useNavigate } from 'react-router-dom';

// This component would be used with React Router
// For now, it's a placeholder for future routing implementation
const ProtectedRoute = ({ children, isAdmin = false }) => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
  const userIsAdmin = sessionStorage.getItem('isAdmin') === 'true';

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (isAdmin && !userIsAdmin) {
      navigate('/dashboard');
      return;
    }
  }, [user, userIsAdmin, isAdmin, navigate]);

  if (!user) {
    return (
      <div className="loading-container">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  if (isAdmin && !userIsAdmin) {
    return (
      <div className="error-container">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
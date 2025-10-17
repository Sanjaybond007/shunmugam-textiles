import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on user role
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'supervisor') {
      navigate('/supervisor');
    }
  }, [user, navigate]);

  return (
    <div className="loading-spinner">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Redirecting...</span>
      </div>
    </div>
  );
};

export default Dashboard; 
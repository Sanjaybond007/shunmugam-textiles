import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.userId || !formData.password) {
      toast.error('User ID and password are required');
      return;
    }

    setLoading(true);

    try {
      const response = await login(formData);
      toast.success('Login successful!');
      
      // Redirect based on role
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/supervisor');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container fade-in">
      <div className="login-card">
        <div className="text-center mb-4">
          <div className="stats-card-icon">🏭</div>
          <h1 className="login-title text-gradient">Shunmugam Textiles</h1>
          <p className="login-subtitle">Management System</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="userId" className="form-label">User ID</label>
            <input
              id="userId"
              name="userId"
              type="text"
              required
              className="form-control"
              placeholder="Enter your user ID"
              value={formData.userId}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4 position-relative">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="btn btn-link position-absolute end-0 top-50 translate-middle-y me-2"
              style={{ border: 'none', background: 'none', marginTop: '12px' }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 py-2"
          >
            {loading ? (
              <>
                <span className="loading-spinner me-2"></span>
                Signing in...
              </>
            ) : (
              <>
                <FaSignInAlt className="me-2" />
                Sign In
              </>
            )}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <small className="text-muted">
            Secure access to textile management system
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login; 
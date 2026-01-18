import { useState } from 'react';
import '../../styles/components.css';

const Login = ({ onLogin, onNavigate, onNavigateToAdmin }) => {
  const [formData, setFormData] = useState({
    contact: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async () => {
    if (!formData.contact || !formData.password) {
      setError("Please enter both Voter ID and Password.");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Direct login without Face Verification
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: formData.contact,
          password: formData.password
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      // Store Token
      sessionStorage.setItem('token', result.token);
      onLogin(result.user);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.contact.trim() !== '' && formData.password.trim() !== '';

  return (
    <div className="auth-wrapper">
      <div className="form-container">
        <h2 className="form-title">SmartBallot Login</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label className="form-label">Voter ID</label>
          <input
            type="text"
            name="contact"
            className="form-input"
            value={formData.contact}
            onChange={handleInputChange}
            required
            placeholder="Enter Voter ID (e.g. VOA-1234)"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleInputChange}
            required
            placeholder="Enter your password"
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleLogin}
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="nav-links">
          <span className="nav-link" onClick={() => onNavigate('register')}>
            Don't have an account? Register
          </span>
          <br />
          <span className="nav-link" style={{ fontSize: '0.8rem', color: '#666' }} onClick={() => onNavigate('adminLogin')}>
            Admin Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
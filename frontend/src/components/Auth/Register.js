import { useState } from 'react';
import '../../styles/components.css';
import Captcha from '../Common/Captcha';
import FaceCapture from './FaceCapture';

const Register = ({ onRegister, onNavigate }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    pin_number: '',
    email: '',
    phone: '',
    password: '', // Still keeping password for backup/admin potential? Plan said remove but schema kept it. Let's keep it for now as per schema.
    confirmPassword: '',
    biometricData: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setStep(2);
  };

  const handleFaceCapture = async (imageSrc) => {
    // We have the face image. Now submit registration.
    const userData = {
      full_name: formData.name,
      pin_number: formData.pin_number,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      biometricData: imageSrc
    };

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      // Successfully registered
      alert(`Registration Successful! Your Voter ID is: ${result.voterId}`);
      onNavigate('login');

    } catch (err) {
      setError(err.message);
      setStep(1); // Go back to start or stay on face capture?
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="auth-wrapper">
        <div className="form-container">
          <h2 className="form-title">SmartBallot Registration</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleStep1Submit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Pin Number (e.g., 22331A0501)</label>
              <input
                type="text"
                name="pin_number"
                className="form-input"
                value={formData.pin_number}
                onChange={handleInputChange}
                required
                placeholder="Unique Student/Voter Pin"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password (Backup)</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            <Captcha onValidate={(isValid) => setIsCaptchaVerified(isValid)} />
            <button type="submit" className="btn btn-primary" disabled={isLoading || !isCaptchaVerified}>
              Next: Setup Face ID
            </button>
          </form>
          <div className="nav-links">
            <span className="nav-link" onClick={() => onNavigate('login')}>
              Already have an account? Login
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="auth-wrapper">
        <FaceCapture
          onCapture={handleFaceCapture}
          mode="register"
          onBack={() => setStep(1)}
          loading={isLoading}
        />
      </div>
    );
  }

  return null;
};

export default Register;
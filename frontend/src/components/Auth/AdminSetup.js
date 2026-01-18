import { useState } from 'react';
import '../../styles/components.css';

const AdminSetup = ({ onNavigate }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async () => {
        if (!formData.username || !formData.password || !formData.confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/seed-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Admin Registration failed');
            }

            setSuccess('Admin registered successfully! You can now login.');

            // Redirect after short delay
            setTimeout(() => {
                onNavigate('adminLogin');
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="form-container">
                <h2 className="form-title">Setup Admin</h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message" style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}

                <div className="form-group">
                    <label className="form-label">Admin Username</label>
                    <input
                        type="text"
                        name="username"
                        className="form-input"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter unique username"
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
                        placeholder="Create password"
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
                        placeholder="Confirm password"
                    />
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleRegister}
                    disabled={isLoading || !formData.username || !formData.password || !formData.confirmPassword}
                >
                    {isLoading ? 'Registering...' : 'Create Admin'}
                </button>

                <div className="nav-links">
                    <span className="nav-link" onClick={() => onNavigate('adminLogin')}>
                        Back to Admin Login
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AdminSetup;

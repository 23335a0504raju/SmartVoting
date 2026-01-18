import { useState } from 'react';
import '../../styles/components.css';

const AdminLogin = ({ onLogin, onNavigate }) => {
    const [formData, setFormData] = useState({
        username: '',
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

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Login failed');
            }

            // Store Token
            sessionStorage.setItem('adminToken', result.token);

            onLogin(result.user, true); // true for isAdmin

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="form-container" style={{ borderTop: '5px solid var(--primary)' }}>
                <h2 className="form-title">Admin Portal</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="form-input"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
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
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Access Dashboard'}
                    </button>
                </form>
                <div className="nav-links">
                    <span className="nav-link" onClick={() => onNavigate('login')}>
                        Back to Voter Login
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

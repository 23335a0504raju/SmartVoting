import { useEffect, useState } from 'react';
import '../../styles/components.css';

const VoterProfile = ({ user, onNavigate, onUpdateUser }) => {
    const [formData, setFormData] = useState({
        gender: '',
        class: '',
        dob: '',
        branch: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Sample Branches for B.Tech
    const branches = [
        'Computer Science & Engineering (CSE)',
        'Electronics & Communication (ECE)',
        'Electrical & Electronics (EEE)',
        'Mechanical Engineering (ME)',
        'Civil Engineering (CE)',
        'Information Technology (IT)',
        'Artificial Intelligence & DS (AIDS)'
    ];

    // Load existing data if available
    useEffect(() => {
        if (user) {
            setFormData({
                gender: user.gender || '',
                class: user.class || '',
                dob: user.dob || '',
                branch: user.branch || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Updating User with ID:", user?.id);
        console.log("Form Data:", formData);
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: user.id,
                    ...formData
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to update profile');
            }

            // Update local user state
            onUpdateUser({ ...user, ...formData });

            alert('Profile Updated Successfully!');
            onNavigate('dashboard');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Complete Your Profile</h2>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select name="gender" className="form-input" value={formData.gender} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Class / Year</label>
                    <input
                        type="text"
                        name="class"
                        className="form-input"
                        placeholder="e.g. 3rd Year B.Tech"
                        value={formData.class}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        className="form-input"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Branch</label>
                    <select name="branch" className="form-input" value={formData.branch} onChange={handleChange} required>
                        <option value="">Select Branch</option>
                        {branches.map(branch => (
                            <option key={branch} value={branch}>{branch}</option>
                        ))}
                    </select>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => onNavigate('dashboard')}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VoterProfile;

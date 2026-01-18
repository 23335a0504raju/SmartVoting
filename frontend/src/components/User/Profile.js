import '../../styles/components.css';

const Profile = ({ user, onNavigate }) => {
  if (!user) {
    return (
      <div className="auth-wrapper">
        <div className="form-container" style={{ textAlign: 'center' }}>
          <h2>Please log in to view your profile</h2>
          <button className="btn btn-primary" onClick={() => onNavigate('login')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-container" style={{ padding: '2rem' }}>
      <div className="form-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 className="form-title" style={{ margin: 0 }}>Voter Profile</h2>
          <button
            className="btn btn-secondary"
            style={{ width: 'auto', padding: '0.5rem 1rem' }}
            onClick={() => onNavigate('dashboard')}
          >
            ← Back to Dashboard
          </button>
          <button
            className="btn btn-primary"
            style={{ width: 'auto', padding: '0.5rem 1rem', marginLeft: '1rem' }}
            onClick={() => onNavigate('voterProfile')}
          >
            Edit Profile
          </button>
        </div>

        <div className="profile-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {/* Personal Information */}
          <div className="profile-section">
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
              Personal Information
            </h3>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="form-input" style={{ background: '#f8f9fa' }}>{user.name || user.full_name}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Voter ID</label>
              <div className="form-input" style={{ background: '#f8f9fa', fontFamily: 'monospace', fontWeight: 'bold' }}>
                {user.voter_id}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Pin Number</label>
              <div className="form-input" style={{ background: '#f8f9fa' }}>{user.pin_number}</div>
            </div>
          </div>

          {/* Contact & Status */}
          <div className="profile-section">
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
              Contact & Status
            </h3>

            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="form-input" style={{ background: '#f8f9fa' }}>{user.email || 'N/A'}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <div className="form-input" style={{ background: '#f8f9fa' }}>{user.phone || 'N/A'}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Account Status</label>
              <div className="form-input" style={{ background: '#f8f9fa', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'var(--success)',
                  display: 'inline-block'
                }}></span>
                Active
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Voting Status</label>
              <div className="form-input" style={{
                background: user.has_voted ? '#dcfce7' : '#fee2e2',
                color: user.has_voted ? '#166534' : '#991b1b',
                fontWeight: '500'
              }}>
                {user.has_voted ? 'Has Voted' : 'Not Voted Yet'}
              </div>
            </div>
          </div>

          {/* Academic & Personal Details */}
          {(user.branch || user.class || user.gender || user.dob) && (
            <div className="profile-section">
              <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                Academic & Personal
              </h3>

              {user.branch && (
                <div className="form-group">
                  <label className="form-label">Branch</label>
                  <div className="form-input" style={{ background: '#f8f9fa' }}>{user.branch}</div>
                </div>
              )}

              {user.class && (
                <div className="form-group">
                  <label className="form-label">Class / Year</label>
                  <div className="form-input" style={{ background: '#f8f9fa' }}>{user.class}</div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {user.gender && (
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <div className="form-input" style={{ background: '#f8f9fa' }}>{user.gender}</div>
                  </div>
                )}
                {user.dob && (
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <div className="form-input" style={{ background: '#f8f9fa' }}>{formatDate(user.dob).split(',')[0]}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* System Information */}
        <div className="profile-section" style={{ marginTop: '2rem' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '1rem' }}>
            System Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Database ID</label>
              <div style={{ fontSize: '0.8rem', color: '#666', fontFamily: 'monospace' }}>{user.id}</div>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Role</label>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>{user.role}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
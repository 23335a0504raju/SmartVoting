import '../../styles/components.css';

const AdminProfile = ({ user, elections, onNavigate }) => {
  const totalElections = elections.length;
  const activeElections = elections.filter(election => election.status === 'active').length;
  const completedElections = elections.filter(election => election.status === 'completed').length;

  const recentElections = elections.slice(0, 5);

  return (
    <div className="form-container" style={{ maxWidth: '900px' }}>
      <div className="profile-header" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="form-title" style={{ margin: 0, textAlign: 'left' }}>{user.name}</h2>
          <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', display: 'inline-block', marginTop: '5px' }}>
            Administrator
          </span>
        </div>
      </div>

      {/* Admin Statistics */}
      <div className="admin-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="stat-card" style={{ padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', background: 'white', borderLeft: '4px solid #3b82f6' }}>
          <span className="stat-number" style={{ fontSize: '2rem', fontWeight: 'bold', display: 'block', color: '#1f2937' }}>{totalElections}</span>
          <span className="stat-label" style={{ color: '#6b7280' }}>Total Elections</span>
        </div>
        <div className="stat-card warning" style={{ padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', background: 'white', borderLeft: '4px solid #eab308' }}>
          <span className="stat-number" style={{ fontSize: '2rem', fontWeight: 'bold', display: 'block', color: '#1f2937' }}>{activeElections}</span>
          <span className="stat-label" style={{ color: '#6b7280' }}>Active Elections</span>
        </div>
        <div className="stat-card success" style={{ padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', background: 'white', borderLeft: '4px solid #22c55e' }}>
          <span className="stat-number" style={{ fontSize: '2rem', fontWeight: 'bold', display: 'block', color: '#1f2937' }}>{completedElections}</span>
          <span className="stat-label" style={{ color: '#6b7280' }}>Completed Elections</span>
        </div>
      </div>

      <div className="profile-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div className="form-group">
          <label className="form-label">Username</label>
          <div className="form-input" style={{ background: '#f9fafb' }}>{user.name}</div>
        </div>
        <div className="form-group">
          <label className="form-label">Role ID</label>
          <div className="form-input" style={{ background: '#f9fafb' }}>{user.id.substring(0, 8)}...</div>
        </div>
      </div>

      {/* Recent Elections */}
      <div className="recent-elections">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3>Recent Activity</h3>
          <button className="btn btn-small btn-secondary" onClick={() => onNavigate('dashboard')}>View All</button>
        </div>

        <div className="election-list">
          {recentElections.length === 0 ? (
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No elections created yet.</p>
          ) : (
            recentElections.map(election => (
              <div key={election.id} className="election-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '10px' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#111827' }}>{election.name || election.title}</h4>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                    Code: <span style={{ fontFamily: 'monospace', background: '#f3f4f6', padding: '2px 4px', borderRadius: '4px' }}>{election.code}</span>
                    {' • '}
                    <span className={`election-status ${election.status === 'active' ? 'status-active' : 'status-completed'}`}>
                      {election.status}
                    </span>
                  </div>
                </div>
                <div className="election-actions" style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="btn btn-small btn-secondary"
                    onClick={() => onNavigate('adminElectionDetails', { election })}
                  >
                    View Details
                  </button>
                  <button
                    className="btn btn-small"
                    onClick={() => onNavigate('adminGenerateResults')}
                  >
                    Results
                  </button>
                </div>
              </div>
            )))}
        </div>
      </div>

      <div className="nav-links" style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <button className="btn btn-primary" onClick={() => onNavigate('adminCreateElection')} style={{ width: '100%' }}>
          Create New Election
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
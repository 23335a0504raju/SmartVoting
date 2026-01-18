
const AdminDashboard = ({ user, elections, onNavigate }) => {
  const totalElections = elections.length;
  const activeElections = elections.filter(election => election.status === 'active').length;
  const completedElections = elections.filter(election => election.status === 'completed').length;

  const quickActions = [
    {
      title: 'Create Election',
      description: 'Setup a new voting election',
      icon: '➕',
      action: () => onNavigate('adminCreateElection')
    },
    {
      title: 'Generate Results',
      description: 'View and analyze election results',
      icon: '📈',
      action: () => onNavigate('adminGenerateResults')
    },
    {
      title: 'Admin Profile',
      description: 'Manage admin settings',
      icon: '👨‍💼',
      action: () => onNavigate('adminProfile')
    }
  ];

  const recentElections = elections.slice(0, 3);

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">Manage elections and view analytics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{totalElections}</span>
          <span className="stat-label">Total Elections</span>
        </div>
        <div className="stat-card warning">
          <span className="stat-number">{activeElections}</span>
          <span className="stat-label">Active Elections</span>
        </div>
        <div className="stat-card success">
          <span className="stat-number">{completedElections}</span>
          <span className="stat-label">Completed Elections</span>
        </div>
      </div>

      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <div key={index} className="action-card" onClick={action.action}>
            <div className="action-icon">{action.icon}</div>
            <div className="action-title">{action.title}</div>
            <div className="action-description">{action.description}</div>
          </div>
        ))}
      </div>

      <div className="admin-grid">
        <div className="election-management">
          <h3>Recent Elections</h3>
          <div className="election-list">
            {recentElections.map(election => (
              <div key={election.id} className="election-item" onClick={() => onNavigate('adminGenerateResults', { election })}>
                <h4>{election.name}</h4>
                <p>Code: {election.code} • Created: {election.createdAt}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span className={`election-status ${election.status === 'active' ? 'status-active' : 'status-completed'}`}>
                    {election.status}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 'bold' }}>View Results →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="recent-activity">
          <h3>System Overview</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">👥</div>
              <div className="activity-content">
                <div className="activity-title">Total Voters</div>
                <div className="activity-time">Estimated 150+ registered</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">✅</div>
              <div className="activity-content">
                <div className="activity-title">System Status</div>
                <div className="activity-time">All systems operational</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🛡️</div>
              <div className="activity-content">
                <div className="activity-title">Security Level</div>
                <div className="activity-time">High - Biometric Enabled</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
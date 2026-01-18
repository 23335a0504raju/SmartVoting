import { useEffect, useState } from 'react';

const UserDashboard = ({ user, elections, onNavigate }) => {
  const activeElections = elections.filter(election => election.status === 'active');
  const participatedElections = user.electionsParticipated;

  const quickActions = [
    {
      title: 'Vote Now',
      description: 'Participate in active elections',
      icon: '🗳️',
      action: () => onNavigate('availableVoting')
    },
    {
      title: 'My Profile',
      description: 'View your profile information',
      icon: '👤',
      action: () => onNavigate('profile')
    }
  ];

  const recentActivities = [
    {
      icon: '✅',
      title: 'Account Verified',
      time: '2 days ago'
    },
    {
      icon: '🗳️',
      title: 'Voted in Student Council Election',
      time: '1 week ago'
    }
  ];

  // ... (previous imports and code)

  // New State for History
  const [votingHistory, setVotingHistory] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      const fetchHistory = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/elections/history/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setVotingHistory(data);
          }
        } catch (error) {
          console.error("Failed to fetch voting history", error);
        }
      };
      fetchHistory();
    }
  }, [user]);

  return (
    <div className="dashboard-content">
      {/* ... (existing header and stats) ... */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome back, {user.name}!</h1>
        <p className="dashboard-subtitle">Ready to make your voice heard?</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{activeElections.length}</span>
          <span className="stat-label">Active Elections</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{votingHistory.length || user.electionsParticipated || 0}</span>
          <span className="stat-label">Elections Participated</span>
        </div>
        <div className="stat-card success">
          <span className="stat-number">Face Recognition</span>
          <span className="stat-label">Verification Method</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <div key={index} className="action-card" onClick={action.action}>
            <div className="action-icon">{action.icon}</div>
            <div className="action-title">{action.title}</div>
            <div className="action-description">{action.description}</div>
          </div>
        ))}
      </div>

      {/* Announced Results Section */}
      {elections.filter(e => (e.status === 'closed' || e.status === 'completed') && e.description && e.description.includes('[ANNOUNCED]')).length > 0 && (
        <div className="active-elections" style={{ marginTop: '2rem' }}>
          <h3>📢 Announced Results</h3>
          <div className="election-list">
            {elections
              .filter(e => (e.status === 'closed' || e.status === 'completed') && e.description && e.description.includes('[ANNOUNCED]'))
              .slice(0, 3)
              .map(election => (
                <div key={election.id} className="election-item" onClick={() => onNavigate('availableVoting', { election: election })} style={{ cursor: 'pointer', borderLeft: '4px solid #10b981' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4>{election.title || election.name}</h4>
                      <p>Code: {election.code} • Results Available</p>
                    </div>
                    <span className="election-status" style={{ background: '#d1fae5', color: '#065f46' }}>Results</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Active Elections Section */}
      {activeElections.length > 0 && (
        <div className="active-elections" style={{ marginTop: '2rem' }}>
          <h3>Active Elections</h3>
          <div className="election-list">
            {activeElections.slice(0, 3).map(election => (
              <div key={election.id} className="election-item" onClick={() => onNavigate('voting', { election: election })} style={{ cursor: 'pointer' }}>
                <h4>{election.title || election.name}</h4>
                <p>Code: {election.code} • {election.candidates ? election.candidates.length : 0} Candidates</p>
                <span className="election-status status-active">Active</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW: Voting History Section */}
      <div className="voting-history" style={{ marginTop: '2.5rem' }}>
        <h3>My Voting History</h3>
        {votingHistory.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic', marginTop: '1rem' }}>You haven't voted in any elections yet.</p>
        ) : (
          <div className="history-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            {votingHistory.map((record) => (
              <div key={record.id} style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                border: '1px solid #eee'
              }}>
                <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderBottom: '1px solid #eee' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#64748b' }}>{record.electionTitle}</h4>
                </div>

                <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {record.candidateSymbol ? (
                    <img
                      src={record.candidateSymbol}
                      alt={record.candidateName}
                      style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }}
                    />
                  ) : (
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                      👤
                    </div>
                  )}

                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: '#1e293b' }}>{record.candidateName}</h3>
                    {record.candidateName !== "NOTA (None of the Above)" && (
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                        {record.candidateBranch} {record.candidateAge ? `• Age: ${record.candidateAge}` : ''}
                      </p>
                    )}
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                      Voted on {new Date(record.votedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="recent-activity" style={{ marginTop: '2.5rem' }}>
        <h3>Recent System Activity</h3>
        <div className="activity-list">
          {recentActivities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">{activity.icon}</div>
              <div className="activity-content">
                <div className="activity-title">{activity.title}</div>
                <div className="activity-time">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default UserDashboard;
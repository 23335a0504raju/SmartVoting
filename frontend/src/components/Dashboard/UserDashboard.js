import { useEffect, useState } from 'react';

const UserDashboard = ({ user, elections, onNavigate }) => {
  const activeElections = elections.filter(election => election.status === 'active');

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e293b' }}>{activeElections.length}</span>
          <span style={{ color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginTop: '0.5rem' }}>Active Elections</span>
        </div>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e293b' }}>{votingHistory.length || user.electionsParticipated || 0}</span>
          <span style={{ color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginTop: '0.5rem' }}>Elections Participated</span>
        </div>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderTop: '6px solid #16a34a', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '1rem' }}>Face Recognition</span>
          <span style={{ color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginTop: 'auto' }}>Verification Method</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {quickActions.map((action, index) => (
          <div key={index} onClick={action.action} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'none'; }}>
            <div style={{ fontSize: '2rem', background: '#e2e8f0', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>{action.icon}</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.25rem' }}>{action.title}</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{action.description}</div>
            </div>
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
                <div key={election.id} onClick={() => onNavigate('availableVoting', { election: election })} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #10b981', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'transform 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.1rem' }}>{election.title || election.name}</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Code: <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{election.code}</span> • Results Available</p>
                  </div>
                  <span style={{ background: '#dcfce7', color: '#166534', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>Results Live</span>
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
              <div key={election.id} onClick={() => onNavigate('voting', { election: election })} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'transform 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.1rem' }}>{election.title || election.name}</h4>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Code: <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{election.code}</span> • {election.candidates ? election.candidates.length : 0} Candidates</p>
                </div>
                <span style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>Active Now</span>
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
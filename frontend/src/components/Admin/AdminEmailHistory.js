import React, { useState, useEffect } from 'react';
import '../../styles/dashboard.css';

const AdminEmailHistory = ({ onNavigate }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/elections/email-history');
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Failed to fetch email history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="dashboard-content">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="dashboard-title">Automated Email Log</h1>
          <p className="dashboard-subtitle">Complete history of election result notifications dispatched to voters.</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchHistory}>🔄 Refresh Logs</button>
      </div>

      <div className="voting-history" style={{ marginTop: '2rem', padding: '1rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading email records...</p>
        ) : history.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No emails have been sent yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '1rem' }}>Timestamp</th>
                  <th style={{ padding: '1rem' }}>Election Title</th>
                  <th style={{ padding: '1rem' }}>Recipient Name</th>
                  <th style={{ padding: '1rem' }}>Email Address</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
                      {new Date(record.sent_at).toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '500', color: '#334155' }}>
                      {record.election_title}
                    </td>
                    <td style={{ padding: '1rem' }}>{record.voter_name}</td>
                    <td style={{ padding: '1rem' }}>{record.voter_email}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ 
                        background: record.status === 'sent' ? '#dcfce7' : '#fee2e2', 
                        color: record.status === 'sent' ? '#166534' : '#991b1b',
                        padding: '0.4rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        minWidth: '80px'
                      }}>
                        {record.status === 'sent' ? 'Sent ✅' : 'Failed ❌'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEmailHistory;

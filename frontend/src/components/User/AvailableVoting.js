import React, { useState } from 'react';
import '../../styles/components.css';

const AvailableVoting = ({ elections, onNavigate, user }) => {
  const [votingCode, setVotingCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);

  const handleVoteClick = (election) => {
    setSelectedElection(election);
    setShowCodeInput(true);
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (votingCode === selectedElection.code) {
      onNavigate('voting', { election: selectedElection });
    } else {
      alert('Invalid voting code');
    }
  };

  const activeElections = elections.filter(election => election.status === 'active');

  if (showCodeInput) {
    return (
      <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '2rem' }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ background: '#f8fafc', padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem', fontWeight: 'bold' }}>Secure Voter Verification</h2>
          </div>
          <div style={{ padding: '2rem' }}>
            <form onSubmit={handleCodeSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontSize: '0.9rem', fontWeight: '600' }}>
                  Election Authentication Code for <strong style={{ color: '#0f172a' }}>{selectedElection.name}</strong>
                </label>
                <input
                  type="text"
                  value={votingCode}
                  onChange={(e) => setVotingCode(e.target.value)}
                  placeholder="Enter your provided code"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '1.1rem',
                    fontFamily: 'monospace',
                    letterSpacing: '2px',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" style={{ flex: 1, padding: '0.8rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.target.style.background = '#1d4ed8'} onMouseOut={(e) => e.target.style.background = '#2563eb'}>
                  Authenticate
                </button>
                <button type="button" onClick={() => setShowCodeInput(false)} style={{ flex: 1, padding: '0.8rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.target.style.background = '#e2e8f0'} onMouseOut={(e) => e.target.style.background = '#f1f5f9'}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Active Elections</h2>
          <p style={{ color: '#64748b', marginTop: '0.5rem', margin: 0 }}>Select an authorized election below to cast your ballot.</p>
        </div>
        <button 
          onClick={() => onNavigate('profile')}
          style={{ padding: '0.6rem 1.2rem', background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseOver={(e) => { e.target.style.background = '#f1f5f9'; e.target.style.color = '#0f172a'; }}
          onMouseOut={(e) => { e.target.style.background = '#f8fafc'; e.target.style.color = '#475569'; }}
        >
          View Profile
        </button>
      </div>

      {activeElections.length === 0 ? (
        <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🗳️</div>
          <h3 style={{ color: '#475569', margin: '0 0 0.5rem 0' }}>No Active Elections</h3>
          <p style={{ color: '#94a3b8', margin: 0 }}>There are currently no open elections available for voting.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {activeElections.map(election => (
            <div key={election.id} style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b', fontWeight: '700', lineHeight: 1.3 }}>{election.name}</h3>
                <span style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>ACTIVE</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: '#64748b' }}>Access Code:</span>
                  <span style={{ fontWeight: '600', color: '#0f172a', fontFamily: 'monospace' }}>{election.code}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: '#64748b' }}>Serial No:</span>
                  <span style={{ fontWeight: '500', color: '#334155' }}>{election.serialNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: '#64748b' }}>Candidates:</span>
                  <span style={{ fontWeight: '500', color: '#334155' }}>{election.candidates.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: '#64748b' }}>Time Limit:</span>
                  <span style={{ fontWeight: '500', color: '#334155' }}>{Math.floor(election.votingTime / 60)}m {election.votingTime % 60}s</span>
                </div>
              </div>

              <button 
                onClick={() => handleVoteClick(election)}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: '#1e293b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = '#0f172a'}
                onMouseOut={(e) => e.target.style.background = '#1e293b'}
              >
                Access Ballot
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableVoting;
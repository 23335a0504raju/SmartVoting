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
      <div className="form-container">
        <h2 className="form-title">Enter Voting Code</h2>
        <form onSubmit={handleCodeSubmit}>
          <div className="form-group">
            <label className="form-label">Voting Code for {selectedElection.name}</label>
            <input
              type="text"
              className="form-input"
              value={votingCode}
              onChange={(e) => setVotingCode(e.target.value)}
              placeholder="Enter voting code"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Proceed to Vote</button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => setShowCodeInput(false)}
            style={{ marginTop: '1rem' }}
          >
            Back
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Available Elections</h2>
      <div className="election-list">
        {activeElections.length === 0 ? (
          <p>No active elections available</p>
        ) : (
          activeElections.map(election => (
            <div key={election.id} className="election-card">
              <h3>{election.name}</h3>
              <p><strong>Code:</strong> {election.code}</p>
              <p><strong>Serial No:</strong> {election.serialNumber}</p>
              <p><strong>Candidates:</strong> {election.candidates.length}</p>
              <p><strong>Voting Time:</strong> {election.votingTime} seconds</p>
              <button 
                className="btn btn-primary"
                onClick={() => handleVoteClick(election)}
                style={{ marginTop: '1rem' }}
              >
                Vote Now
              </button>
            </div>
          ))
        )}
      </div>
      <div className="nav-links">
        <span className="nav-link" onClick={() => onNavigate('profile')}>
          View Profile
        </span>
      </div>
    </div>
  );
};

export default AvailableVoting;
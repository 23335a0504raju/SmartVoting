import { useEffect, useState } from 'react';
import '../../styles/components.css';
import ElectionResults from '../Common/ElectionResults';

const AdminGenerateResults = ({ elections, onNavigate, initialElection }) => {
  const [formData, setFormData] = useState({
    electionCode: '',
    electionName: ''
  });
  const [selectedElection, setSelectedElection] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [announcing, setAnnouncing] = useState(false);
  const [notifiedVoters, setNotifiedVoters] = useState([]);

  useEffect(() => {
    if (initialElection) {
      setSelectedElection(initialElection);
      setShowResults(true);
      // Pre-fill form data just in case
      setFormData({
        electionCode: initialElection.code || '',
        electionName: initialElection.name || initialElection.title || ''
      });
    }
  }, [initialElection]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Find election by code and name
    const election = elections.find(elec =>
      elec.code === formData.electionCode &&
      elec.name === formData.electionName
    );

    if (election) {
      setSelectedElection(election);
      setShowResults(true);
    } else {
      alert('No election found with the provided code and name.');
    }
  };

  const handleAnnounce = async () => {
    if (!selectedElection) return;
    if (!window.confirm("Are you sure you want to ANNOUNCE these results? This will close the election and make results visible to all voters.")) return;

    setAnnouncing(true);
    try {
      const response = await fetch(`http://localhost:5000/api/elections/${selectedElection.id}/announce`, {
        method: 'POST'
      });

      if (response.ok) {
        const result = await response.json();
        alert("Results Announced Successfully! Voters can now see the results.");
        // Update local state: closed status and tag
        setSelectedElection({
          ...selectedElection,
          status: 'closed',
          description: `[ANNOUNCED] ${selectedElection.description || ''}`
        });

        if (result.notifiedVoters && result.notifiedVoters.length > 0) {
            setNotifiedVoters(result.notifiedVoters);
        }
      } else {
        alert("Failed to announce results.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error.");
    } finally {
      setAnnouncing(false);
    }
  };



  return (
    <div className="form-container" style={{ maxWidth: '1000px' }}>

      {!showResults ? (
        <>
          <h2 className="form-title">Generate Election Results</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Election Code</label>
              <input
                type="text"
                name="electionCode"
                className="form-input"
                value={formData.electionCode}
                onChange={handleInputChange}
                placeholder="Enter election code"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Election Name</label>
              <input
                type="text"
                name="electionName"
                className="form-input"
                value={formData.electionName || ''}
                onChange={handleInputChange}
                placeholder="Enter election name"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Generate Results
            </button>

            <div className="available-elections" style={{ marginTop: '2rem' }}>
              <h4>Available Elections:</h4>
              <div className="election-list">
                {elections.map(election => (
                  <div
                    key={election.id}
                    className="election-item-small"
                    onClick={() => {
                      setFormData({
                        electionCode: election.code,
                        electionName: election.name
                      });
                      // Auto-select and show results
                      setSelectedElection(election);
                      setShowResults(true);
                    }}
                  >
                    <strong>{election.name}</strong>
                    <br />
                    <small>Code: {election.code} | Candidates: {election.candidates.length}</small>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </>
      ) : (
        <div>
          <ElectionResults election={selectedElection} showDownload={false} />

          <div className="results-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            {(selectedElection.description && selectedElection.description.includes('[ANNOUNCED]')) ? (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn" disabled style={{ background: '#d1fae5', color: '#065f46', cursor: 'default' }}>
                  ✅ Announced
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={async () => {
                    if (!window.confirm("Are you sure you want to withdraw the results? Voters will no longer see them.")) return;

                    try {
                      setAnnouncing(true);
                      const response = await fetch(`http://localhost:5000/api/elections/${selectedElection.id}/withdraw`, {
                        method: 'POST'
                      });

                      if (response.ok) {
                        alert("Results Withdrawn.");
                        // Update local state: remove tag
                        setSelectedElection({
                          ...selectedElection,
                          description: selectedElection.description.replace('[ANNOUNCED]', '').trim()
                        });
                      } else {
                        alert("Failed to withdraw results.");
                      }
                    } catch (e) {
                      console.error(e);
                      alert("Network error.");
                    } finally {
                      setAnnouncing(false);
                    }
                  }}
                  style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}
                >
                  🚫 Withdraw Results
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleAnnounce}
                disabled={announcing}
                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
              >
                {announcing ? 'Announcing...' : '📢 Announce Results'}
              </button>
            )}

            <button
              className="btn btn-primary"
              onClick={() => window.print()}
            >
              <span>🖨️</span> Print
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowResults(false)} // Go back to selector
            >
              Back
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => onNavigate('dashboard')}
            >
              Dashboard
            </button>
          </div>

          {notifiedVoters && notifiedVoters.length > 0 && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', maxWidth: '600px', margin: '2rem auto' }}>
              <h4 style={{ color: '#0f172a', marginBottom: '1rem', textAlign: 'center' }}>📧 Email Notifications Successfully Sent To:</h4>
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
                {notifiedVoters.map((voter, index) => (
                  <li key={index} style={{ padding: '0.75rem', background: 'white', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: '#1e293b' }}>{voter.full_name}</strong>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{voter.email}</span>
                  </li>
                ))}
              </ul>
              <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#10b981', fontWeight: 'bold' }}>All listed voters successfully received their personalized result packets.</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default AdminGenerateResults;
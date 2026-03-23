import { useEffect, useState } from 'react';
import LivenessChallenge from '../Auth/LivenessChallenge';

const Voting = ({ onNavigate, elections, onVote, user, updateUserParticipation, selectedElection }) => {
  const [step, setStep] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [votingCompleted, setVotingCompleted] = useState(false);

  const [hasAlreadyVoted, setHasAlreadyVoted] = useState(false);

  useEffect(() => {
    if (!selectedElection) {
      onNavigate('availableVoting');
      return;
    }

    const checkVoteStatus = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/elections/${selectedElection.id}/vote?userId=${user.id}`);
        const data = await response.json();
        if (data.hasVoted) {
          setHasAlreadyVoted(true);
        }
      } catch (error) {
        console.error("Failed to check vote status:", error);
      }
    };

    if (user && selectedElection) {
      checkVoteStatus();
    }
  }, [selectedElection, onNavigate, user]);

  // Use selectedElection instead of hardcoded one
  const election = selectedElection;

  useEffect(() => {
    if (step === 3 && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === 3 && timeLeft === 0) {
      // eslint-disable-next-line
      handleVoteSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, timeLeft]);

  const handleFaceVerify = async (frames) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voterId: user.id,
          images: frames // Send list of frames for blink check
        })
      });

      const result = await response.json();

      if (result.success) {
        setStep(2);
        return result;
      } else {
        return result; // Return full error object
      }
    } catch (error) {
      console.error(error);
      return { success: false, error: "Network or Server Error" };
    }
  };

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleVoteSubmit = () => {
    if (selectedCandidate) {
      onVote(election.id, selectedCandidate.id);
    } else {
      // Vote for NOTA (None of the Above)
      onVote(election.id, 'nota');
    }
    updateUserParticipation(user.id);
    setVotingCompleted(true);

    setTimeout(() => {
      onNavigate('availableVoting');
    }, 3000);
  };

  // Guard clause to prevent rendering if election is null
  if (!election) return null;

  if (hasAlreadyVoted) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 2rem' }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✅</div>
          <h2 style={{ color: '#16a34a', fontSize: '2rem', fontWeight: '800', margin: '0 0 1rem 0' }}>Vote Recorded</h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Your secure ballot for <strong style={{ color: '#0f172a' }}>{election.name}</strong> has already been successfully deposited and encrypted.
          </p>
          <button
            onClick={() => onNavigate('availableVoting')}
            style={{ padding: '1rem 2rem', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', width: '100%', fontSize: '1.1rem' }}
            onMouseOver={(e) => { e.target.style.background = '#f1f5f9'; e.target.style.borderColor = '#94a3b8'; }}
            onMouseOut={(e) => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#cbd5e1'; }}
          >
            Return to Active Elections
          </button>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="auth-wrapper" style={{ maxWidth: '800px', margin: '0 auto' }}>

        <LivenessChallenge
          user={user}
          onVerify={handleFaceVerify}
          onCancel={() => onNavigate('availableVoting')}
        />

      </div>
    );
  }

  if (step === 2) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 2rem' }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' }}>
            <span style={{ fontSize: '2.5rem' }}>🧑‍💻</span>
          </div>
          <h2 style={{ color: '#0f172a', fontSize: '2rem', fontWeight: '800', margin: '0 0 1rem 0' }}>Identity Verified</h2>
          <p style={{ color: '#475569', fontSize: '1.1rem', marginBottom: '1rem' }}>
            Biometric verification successful. You are authorized to access the secure ballot for <strong style={{ color: '#0f172a' }}>{election.name}</strong>.
          </p>
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '1rem', borderRadius: '8px', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
            ⚠️ <strong>Notice:</strong> You will have strictly 2 minutes to cast your vote once you proceed.
          </div>
          <button
            onClick={() => setStep(3)}
            style={{ padding: '1rem 2rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s', width: '100%', fontSize: '1.1rem', letterSpacing: '0.5px' }}
            onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.background = '#2563eb'}
          >
            Access Official Ballot →
          </button>
        </div>
      </div>
    );
  }

  if (votingCompleted) {
    return (
      <div className="form-container">
        <h2 className="form-title">Vote Submitted Successfully!</h2>
        <p>Thank you for participating in the election.</p>
        <p>Redirecting to available voting page...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem', paddingBottom: '8rem' }}>
      {/* Sticky Header with Timer */}
      <div style={{ position: 'sticky', top: '1rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', zIndex: 10, marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>{election.name}</h2>
          <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Official Secure Ballot</p>
        </div>
        <div style={{ background: timeLeft < 30 ? '#fee2e2' : '#f1f5f9', border: `1px solid ${timeLeft < 30 ? '#fca5a5' : '#cbd5e1'}`, color: timeLeft < 30 ? '#dc2626' : '#334155', padding: '0.5rem 1rem', borderRadius: '30px', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s' }}>
          ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem', color: '#475569', fontSize: '1.1rem', fontWeight: '500' }}>
        Please select <strong style={{ color: '#0f172a' }}>ONE</strong> candidate from the list below:
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {election.candidates.map((candidate, index) => {
          const isSelected = selectedCandidate?.id === candidate.id;
          return (
            <div
              key={candidate.id || index}
              onClick={() => handleCandidateSelect(candidate)}
              style={{
                background: isSelected ? '#eff6ff' : '#ffffff',
                border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                boxShadow: isSelected ? '0 10px 15px -3px rgba(37, 99, 235, 0.1)' : '0 4px 6px -1px rgba(0,0,0,0.02)'
              }}
              onMouseOver={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
              onMouseOut={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'none'; } }}
            >
              {isSelected && (
                <div style={{ position: 'absolute', top: '15px', right: '15px', background: '#2563eb', color: 'white', border: '2px solid white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>✓</div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                {candidate.symbolUrl ? (
                  <img src={candidate.symbolUrl} alt={candidate.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
                ) : (
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👤</div>
                )}
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: isSelected ? '#1e3a8a' : '#1e293b', fontWeight: '700' }}>{candidate.name}</h3>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>{candidate.branch} • Age {candidate.age}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* NOTA Option */}
        <div
          onClick={() => setSelectedCandidate(null)}
          style={{
            background: !selectedCandidate ? '#fef2f2' : '#ffffff',
            border: !selectedCandidate ? '2px solid #dc2626' : '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            boxShadow: !selectedCandidate ? '0 10px 15px -3px rgba(220, 38, 38, 0.1)' : '0 4px 6px -1px rgba(0,0,0,0.02)'
          }}
          onMouseOver={(e) => { if (selectedCandidate) { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
          onMouseOut={(e) => { if (selectedCandidate) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'none'; } }}
        >
          {!selectedCandidate && (
            <div style={{ position: 'absolute', top: '15px', right: '15px', background: '#dc2626', color: 'white', border: '2px solid white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>✓</div>
          )}
          <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem', opacity: !selectedCandidate ? 1 : 0.4 }}>🚫</span>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: !selectedCandidate ? '#991b1b' : '#64748b', fontWeight: '700' }}>NOTA</h3>
          <p style={{ margin: '0.25rem 0 0 0', color: !selectedCandidate ? '#b91c1c' : '#94a3b8', fontSize: '0.8rem' }}>(None of the Above)</p>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 -10px 25px rgba(0,0,0,0.05)', zIndex: 10 }}>
        <div style={{ maxWidth: '1000px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#475569', fontSize: '0.95rem' }}>
            {selectedCandidate ? (
              <>Ready to cast vote for <strong style={{ color: '#2563eb' }}>{selectedCandidate.name}</strong></>
            ) : (
              <>Ready to cast vote for <strong style={{ color: '#dc2626' }}>NOTA</strong></>
            )}
          </div>
          <button
            onClick={handleVoteSubmit}
            disabled={!selectedCandidate && timeLeft > 0}
            style={{
              padding: '1rem 3rem',
              background: (!selectedCandidate && timeLeft > 0) ? '#cbd5e1' : '#1e293b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              cursor: (!selectedCandidate && timeLeft > 0) ? 'not-allowed' : 'pointer',
              letterSpacing: '1px',
              transition: 'background 0.2s',
              boxShadow: (!selectedCandidate && timeLeft > 0) ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.2)'
            }}
            onMouseOver={(e) => { if (selectedCandidate || timeLeft === 0) e.target.style.background = '#0f172a'; }}
            onMouseOut={(e) => { if (selectedCandidate || timeLeft === 0) e.target.style.background = '#1e293b'; }}
          >
            CAST SECURE BALLOT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Voting;
import { useEffect, useState } from 'react';
import LivenessChallenge from '../Auth/LivenessChallenge';

const Voting = ({ onNavigate, elections, onVote, user, updateUserParticipation, selectedElection }) => {
  const [step, setStep] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
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
      <div className="form-container" style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
        <h2 className="form-title" style={{ color: '#28a745' }}>You have already voted!</h2>
        <p className="form-subtitle">Your vote for <strong>{election.name}</strong> has been recorded.</p>
        <button
          className="btn btn-primary"
          onClick={() => onNavigate('availableVoting')}
          style={{ marginTop: '2rem' }}
        >
          Back to Elections
        </button>
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
      <div className="form-container">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 className="form-title">Identity Verified</h2>
          <p>You are authorized to vote in <strong>{election.name}</strong></p>
          <p>Proceed to the ballot. You will have 15 seconds to select a candidate.</p>
          <button
            className="btn btn-primary"
            onClick={() => setStep(3)}
            style={{ marginTop: '2rem' }}
          >
            Proceed to Ballot
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
    <div className="voting-container">
      <h2 className="form-title">{election.name}</h2>
      <div className="timer">
        Time Left: {timeLeft}s
      </div>
      <p>Select your candidate:</p>

      <div className="candidate-list">
        {election.candidates.map((candidate, index) => (
          <div
            key={candidate.id || index}
            className={`candidate-item ${selectedCandidate?.id === candidate.id ? 'selected' : ''}`}
            onClick={() => handleCandidateSelect(candidate)}
          >
            <h3>{candidate.name}</h3>
          </div>
        ))}
        <div
          className={`candidate-item ${!selectedCandidate ? 'selected' : ''}`}
          onClick={() => setSelectedCandidate(null)}
        >
          <h3>NOTA (None of the Above)</h3>
        </div>
      </div>

      <button
        className="btn btn-primary"
        onClick={handleVoteSubmit}
        disabled={!selectedCandidate && timeLeft > 0}
      >
        Submit Vote {selectedCandidate ? `for ${selectedCandidate.name}` : 'as NOTA'}
      </button>

      <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        {!selectedCandidate ? 'If no candidate is selected within 15 seconds, your vote will be counted as NOTA' : ''}
      </p>
    </div>
  );
};

export default Voting;
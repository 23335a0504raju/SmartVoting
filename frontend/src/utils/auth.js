// Utility functions for authentication and helpers
export const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^\+?[\d\s-()]{10,}$/;
  return re.test(phone);
};

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const calculateWinner = (candidates) => {
  if (!candidates || candidates.length === 0) return { winner: null, runner: null };

  // Safe sort treating undefined as 0
  const sorted = [...candidates].sort((a, b) => (b.votes || 0) - (a.votes || 0));

  // Handle empty or zero-vote cases
  const winner = sorted[0];
  const runner = sorted[1] || null;

  return {
    winner: (winner && (winner.votes || 0) > 0) ? winner : { name: "No Votes Yet", votes: 0 },
    runner: (runner && (runner.votes || 0) > 0) ? runner : null
  };
};

export const generateBarGraphData = (candidates) => {
  const totalVotes = candidates.reduce((sum, c) => sum + (c.votes || 0), 0);

  return candidates.map(candidate => {
    const votes = candidate.votes || 0;
    return {
      name: candidate.name,
      votes: votes,
      percentage: totalVotes > 0 ? (votes / totalVotes) * 100 : 0
    };
  });
};
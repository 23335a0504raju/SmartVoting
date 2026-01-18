import { useEffect, useState } from 'react';
import AdminLogin from './components/Auth/AdminLogin';
import AdminSetup from './components/Auth/AdminSetup';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import About from './components/Common/About';
import Dashboard from './components/Layout/Dashboard';
import Navbar from './components/Layout/Navbar';
import VoterProfile from './components/User/VoterProfile';
import './styles/App.css';
import './styles/dashboard.css';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [selectedElection, setSelectedElection] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data state
  const [users, setUsers] = useState([]);
  const [elections, setElections] = useState([]);

  // http://localhost:3000/#admin-secret-setup Add admin page
  // Fetch Data on Load
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/elections');
        if (response.ok) {
          const data = await response.json();
          setElections(data);
        }
      } catch (error) {
        console.error("Failed to fetch elections:", error);
      }
    };

    const fetchUserProfile = async (userId) => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/profile/${userId}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          sessionStorage.setItem('currentUser', JSON.stringify(userData));
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchElections();

    document.title = "SmartBallot - AI Voting";
    const savedUser = sessionStorage.getItem('currentUser');
    const savedIsAdmin = sessionStorage.getItem('isAdmin');
    const savedView = sessionStorage.getItem('currentView'); // Restore view

    // Restore selected election if available
    const savedElection = sessionStorage.getItem('selectedElection');
    let parsedElection = null;
    if (savedElection) {
      try {
        parsedElection = JSON.parse(savedElection);
        setSelectedElection(parsedElection);
      } catch (e) {
        console.error("Failed to parse saved election", e);
      }
    }

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAdmin(savedIsAdmin === 'true');

      // Refresh user data from backend
      if (!savedIsAdmin || savedIsAdmin === 'false') {
        fetchUserProfile(parsedUser.id);
      }

      // Restore view ONLY if data is consistent
      const restoredView = savedView || 'dashboard';
      if (restoredView === 'adminElectionDetails' && !parsedElection) {
        setCurrentView('dashboard'); // Fallback if election missing
      } else {
        setCurrentView(restoredView);
      }
    }
  }, []);

  // Enhanced navigation handler that supports passing data
  const handleNavigate = (viewName, data = null) => {
    setCurrentView(viewName);
    sessionStorage.setItem('currentView', viewName); // Persist view

    if (data && data.election) {
      setSelectedElection(data.election);
      sessionStorage.setItem('selectedElection', JSON.stringify(data.election));
    } else if (viewName === 'dashboard' || viewName === 'elections' || viewName === 'availableVoting') {
      // Clear selection when going back to lists
      setSelectedElection(null);
      sessionStorage.removeItem('selectedElection');
    }
  };

  const handleLogin = (userData, admin = false) => {
    // SECURITY: Clear any existing session to prevent contamination
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('currentView');

    // Set new session
    setUser(userData);
    setIsAdmin(admin);
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
    sessionStorage.setItem('isAdmin', admin.toString());
    handleNavigate('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('token'); // Clear Auth Token
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('currentView'); // Clear View
    handleNavigate('login');
    setSidebarOpen(false);
  };

  const handleRegister = (userData) => {
    // This might not be hit if Register.js handles its own nav, but keeping for consistency
    const newUser = {
      ...userData,
      id: users.length + 1,
      electionsParticipated: 0,
      isAdmin: false
    };
    setUsers([...users, newUser]);
    handleLogin(newUser, false);
  };

  const addElection = (newElection) => {
    setElections([newElection, ...elections]);
  };

  const updateVote = async (electionId, candidateId) => {
    if (!user) {
      alert("Please login to vote.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/elections/${electionId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          candidateId: candidateId
        })
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to cast vote.");
        return;
      }

      // Update local state only on success
      setElections(elections.map(election => {
        if (election.id === electionId) {
          return {
            ...election,
            candidates: election.candidates.map(candidate =>
              candidate.id === candidateId
                ? { ...candidate, votes: (candidate.votes || 0) + 1 }
                : candidate
            )
          };
        }
        return election;
      }));

    } catch (error) {
      console.error("Vote network error:", error);
      alert("Network error. Please try again.");
    }
  };

  const updateUserParticipation = (userId) => {
    setUsers(users.map(u =>
      u.id === userId
        ? { ...u, electionsParticipated: u.electionsParticipated + 1 }
        : u
    ));
  };

  // Wrapper to update user state AND sessionStorage
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    if (!user) {
      switch (currentView) {
        case 'login':
          return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
        case 'adminLogin':
          return <AdminLogin onLogin={handleLogin} onNavigate={handleNavigate} />;
        case 'register':
          return <Register onRegister={handleRegister} onNavigate={handleNavigate} />;
        case 'adminSetup':
          return <AdminSetup onNavigate={handleNavigate} />;
        case 'voterProfile':
          return <VoterProfile user={user} onNavigate={handleNavigate} onUpdateUser={handleUserUpdate} />;
        case 'about':
          return <About onNavigate={handleNavigate} />;
        default:
          return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
      }
    }

    return (
      <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div className="main-content" style={{ marginLeft: 0, width: '100%', padding: '2rem' }}>
          <Dashboard
            currentView={currentView}
            user={user}
            isAdmin={isAdmin}
            elections={elections}
            onVote={updateVote}
            onAddElection={addElection}
            updateUserParticipation={updateUserParticipation}
            onNavigate={handleNavigate}
            selectedElection={selectedElection}
            onUpdateUser={handleUserUpdate}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <Navbar
        user={user}
        onLogout={handleLogout}
        onToggleSidebar={toggleSidebar}
        currentView={currentView}
        onNavigate={handleNavigate}
      />
      {renderContent()}
    </div>
  );
}

export default App;
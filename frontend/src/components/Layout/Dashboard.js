import AdminCreateElection from '../Admin/AdminCreateElection';
import AdminElectionDetails from '../Admin/AdminElectionDetails';
import AdminGenerateResults from '../Admin/AdminGenerateResults';
import AdminProfile from '../Admin/AdminProfile';
import About from '../Common/About';
import AdminDashboard from '../Dashboard/AdminDashboard';
import UserDashboard from '../Dashboard/UserDashboard';
import Elections from '../User/Elections';
import Profile from '../User/Profile';
import VoterProfile from '../User/VoterProfile';
import Voting from '../User/Voting';

const Dashboard = ({
  currentView,
  user,
  isAdmin,
  elections,
  onVote,
  onAddElection,
  updateUserParticipation,
  onNavigate,
  selectedElection,
  onUpdateUser
}) => {

  const renderView = () => {
    if (currentView === 'dashboard') {
      return isAdmin ?
        <AdminDashboard user={user} elections={elections} onNavigate={onNavigate} /> :
        <UserDashboard user={user} elections={elections} onNavigate={onNavigate} />;
    }

    switch (currentView) {
      case 'availableVoting':
        return <Elections elections={elections} onNavigate={onNavigate} user={user} />;
      case 'voting':
        return <Voting
          onNavigate={onNavigate}
          elections={elections}
          selectedElection={selectedElection}
          onVote={onVote}
          user={user}
          updateUserParticipation={updateUserParticipation}
        />;
      case 'profile':
        return <Profile user={user} onNavigate={onNavigate} />;
      case 'voterProfile':
        return <VoterProfile user={user} onNavigate={onNavigate} onUpdateUser={onUpdateUser} />;
      case 'adminCreateElection':
        return <AdminCreateElection onAddElection={onAddElection} onNavigate={onNavigate} user={user} />;
      case 'adminGenerateResults':
        return <AdminGenerateResults elections={elections} onNavigate={onNavigate} initialElection={selectedElection} />;
      case 'adminProfile':
        return <AdminProfile user={user} elections={elections} onNavigate={onNavigate} />;
      case 'adminElectionDetails':
        return <AdminElectionDetails election={selectedElection} onNavigate={onNavigate} />;
      case 'about':
        return <About onNavigate={onNavigate} />;
      default:
        return isAdmin ?
          <AdminDashboard user={user} elections={elections} onNavigate={onNavigate} /> :
          <UserDashboard user={user} elections={elections} onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="dashboard">
      {renderView()}
    </div>
  );
};

export default Dashboard;
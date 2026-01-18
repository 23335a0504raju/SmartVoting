import '../../styles/components.css';

const Sidebar = ({ isOpen, onClose, currentView, onNavigate, isAdmin, elections = [] }) => {
  const userMenuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'availableVoting', label: 'Available Elections', icon: '🗳️' },
    { key: 'profile', label: 'My Profile', icon: '👤' },
    { key: 'about', label: 'About Project', icon: 'ℹ️' }
  ];

  const adminMenuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'adminCreateElection', label: 'Create New Election', icon: '➕' }, // Clarified label
    { key: 'adminProfile', label: 'Admin Profile', icon: '👨‍💼' },
    { key: 'about', label: 'About Project', icon: 'ℹ️' }
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  // For Admin: Show ALL elections directly in sidebar
  const sidebarElections = isAdmin && elections ? elections : [];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="sidebar-close" onClick={onClose}>×</button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.key}
              className={`sidebar-item ${currentView === item.key ? 'active' : ''}`}
              onClick={() => {
                onNavigate(item.key);
                // onClose(); // Keep sidebar open
              }}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}

          {/* Admin: All Elections Section */}
          {isAdmin && sidebarElections.length > 0 && (
            <div className="sidebar-section" style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '10px' }}>
              <div style={{ color: '#888', fontSize: '0.8rem', padding: '0 20px', marginBottom: '5px', textTransform: 'uppercase' }}>
                All Elections
              </div>
              {sidebarElections.map(election => (
                <button
                  key={election.id}
                  className={`sidebar-item ${currentView === 'adminElectionDetails' && election.id ? 'active' : ''}`} // Simplistic active check
                  onClick={() => {
                    onNavigate('adminElectionDetails', { election });
                    // onClose(); // Keep sidebar open
                  }}
                >
                  <span className="sidebar-icon">🗳️</span>
                  <span className="sidebar-label" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {election.name || election.title}
                  </span>
                </button>
              ))}
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info-sidebar">
            <div className="user-avatar-sidebar">
              {isAdmin ? 'A' : 'U'}
            </div>
            <div className="user-details">
              <strong>{isAdmin ? 'Admin' : 'Voter'}</strong>
              <small>Online</small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
import '../../styles/components.css';

const Navbar = ({ user, onLogout, onToggleSidebar, currentView, onNavigate }) => {


  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            🗳️
          </div>
          <h1 className="navbar-title">SmartVoting</h1>
        </div>
      </div>

      <div className="navbar-center" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            <button
              className={`nav-link-item ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => onNavigate('dashboard')}
            >
              Dashboard
            </button>
            {user.role === 'admin' ? (
              <>
                <button
                  className={`nav-link-item ${currentView === 'adminCreateElection' ? 'active' : ''}`}
                  onClick={() => onNavigate('adminCreateElection')}
                >
                  Create Election
                </button>
                <button
                  className={`nav-link-item ${currentView === 'adminProfile' ? 'active' : ''}`}
                  onClick={() => onNavigate('adminProfile')}
                >
                  Admin Profile
                </button>
              </>
            ) : (
              <>
                <button
                  className={`nav-link-item ${currentView === 'availableVoting' ? 'active' : ''}`}
                  onClick={() => onNavigate('availableVoting')}
                >
                  Elections
                </button>
                <button
                  className={`nav-link-item ${currentView === 'profile' ? 'active' : ''}`}
                  onClick={() => onNavigate('profile')}
                >
                  Profile
                </button>
              </>
            )}
            <button
              className={`nav-link-item ${currentView === 'about' ? 'active' : ''}`}
              onClick={() => onNavigate('about')}
            >
              About
            </button>
          </>
        ) : (
          <button
            className={`nav-link-item ${currentView === 'about' ? 'active' : ''}`}
            onClick={() => onNavigate && onNavigate('about')}
          >
            About Project
          </button>
        )}
      </div>

      <div className="navbar-right">
        {user ? (
          <div className="user-menu">
            <span className="user-greeting">Welcome, {user.name}</span>
            <div className="user-dropdown">
              <button className="user-btn">
                <span className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </button>
              <div className="dropdown-content">
                <button onClick={() => window.location.reload()} className="dropdown-item">
                  Refresh
                </button>
                <button onClick={onLogout} className="dropdown-item logout">
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="guest-menu" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={() => onNavigate && onNavigate('login')} style={{ padding: '0.5rem 1rem' }}>
              Login
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
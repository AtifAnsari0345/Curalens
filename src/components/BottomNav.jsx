import { NavLink } from 'react-router-dom'

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink 
        to="/dashboard" 
        className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        aria-label="Dashboard"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>Dashboard</span>
      </NavLink>
      
      <NavLink 
        to="/scan" 
        className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        aria-label="Scan"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="7" y1="7" x2="7" y2="7"></line>
          <line x1="17" y1="7" x2="17" y2="7"></line>
          <line x1="7" y1="17" x2="7" y2="17"></line>
          <line x1="17" y1="17" x2="17" y2="17"></line>
          <line x1="12" y1="7" x2="12" y2="17"></line>
          <line x1="7" y1="12" x2="17" y2="12"></line>
        </svg>
        <span>Scan</span>
      </NavLink>
      
      <NavLink 
        to="/drug-interaction" 
        className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        aria-label="Drug Interaction"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12h6"></path>
          <path d="M12 9v6"></path>
          <circle cx="12" cy="12" r="9"></circle>
        </svg>
        <span>Interactions</span>
      </NavLink>
      
      <NavLink 
        to="/profile" 
        className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        aria-label="Profile"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Profile</span>
      </NavLink>
    </nav>
  )
}

export default BottomNav
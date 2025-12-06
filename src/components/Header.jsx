import { Link } from 'react-router-dom';
import PWAInstallButton from './PWAInstallButton';

function Header() {
  return (
    <header className="header">
      <div className="header-logo">
        <img src="/Curalens app logo.png" alt="CuraLens Logo" className="app-logo" />
        <h1>CuraLens</h1>
      </div>
      <div className="header-actions">
        <PWAInstallButton />
      </div>
    </header>
  )
}

export default Header
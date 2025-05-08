import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import marlinsLogo from '../assets/marlins-logo.png'; // Adjust the path to your logo file

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo-link">
        <img src={marlinsLogo} alt="Florida Marlins Logo" className="navbar-logo" />
      </Link>
      <ul className="navbar-list">
        <li className="navbar-item"><Link to="/roster">Roster</Link></li>
        <li className="navbar-item"><Link to="/standings">Standings</Link></li>
        <li className="navbar-item"><Link to="/stats">Stats</Link></li>
        <li className="navbar-item"><Link to="/gameday">Gameday</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
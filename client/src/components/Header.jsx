import { useState } from 'react';
import './Header.css';
import { Link, NavLink } from 'react-router-dom';

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="site-logo">
          <img src="/favicon.png" alt="Très Jolie" className="header-logo-img" />
          <span className="logo-text">Très Jolie</span>
        </Link>
        
        <nav className="site-nav">
          {/* Clothing and Jewelry - Only on Desktop */}
          <div className="nav-group hide-on-mobile">
            <NavLink to="/clothing" className={({ isActive }) => isActive ? 'active-link' : ''}>Clothing</NavLink>
            <NavLink to="/jewelry" className={({ isActive }) => isActive ? 'active-link' : ''}>Jewelry</NavLink>
          </div>

          {/* More and Featured - On both (Featured is always visible, More is the empty placeholder) */}
          <div className="nav-group">
            <div 
              className="dropdown-container"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className="dropdown-trigger">
                More 
                <svg 
                  className={`chevron ${isDropdownOpen ? 'up' : ''}`}
                  width="10" height="6" viewBox="0 0 10 6" fill="none"
                >
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-empty">Coming soon...</div>
                </div>
              )}
            </div>
            
            <a href="/#featured" className="featured-link">Featured</a>
          </div>
        </nav>
      </div>
    </header>
  );
}

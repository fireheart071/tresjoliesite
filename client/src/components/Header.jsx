import { useState } from 'react';
import './Header.css';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ALL_CATEGORIES } from '../constants/categories';

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  // Find the current active category to move it to the first slot
  const currentPath = location.pathname;
  const activeCategory = ALL_CATEGORIES.find(cat => cat.path === currentPath);

  // Reorder categories for display
  const displayItems = activeCategory 
    ? [activeCategory, ...ALL_CATEGORIES.filter(cat => cat.path !== currentPath)]
    : ALL_CATEGORIES;

  // Split into Main (first 2 visible on desktop) and Extra (dropdown)
  const mainItems = displayItems.slice(0, 2);
  const extraItems = displayItems.slice(2);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="site-logo">
          <img src="/favicon.png" alt="Très Jolie" className="header-logo-img" />
          <span className="logo-text">Très Jolie</span>
        </Link>
        
        <nav className="site-nav">
           {/* Desktop Categories - First 2 visible */}
          <div className="nav-group hide-on-mobile">
            {mainItems.map(cat => (
              <NavLink key={cat.name} to={cat.path} className={({ isActive }) => isActive ? 'active-link' : ''}>
                {cat.name}
              </NavLink>
            ))}
          </div>

          {/* More and Featured */}
          <div className="nav-group">
            <div 
              className="dropdown-container"
              onMouseEnter={() => window.innerWidth > 992 && setIsDropdownOpen(true)}
              onMouseLeave={() => window.innerWidth > 992 && setIsDropdownOpen(false)}
            >
              <button 
                className="dropdown-trigger"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
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
                  {/* Show all categories in dropdown on mobile, but only extra ones on desktop */}
                  {ALL_CATEGORIES.map((cat) => {
                    const isMainItem = mainItems.some(m => m.path === cat.path);
                    return (
                      <NavLink 
                        key={cat.name} 
                        to={cat.path}
                        className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''} ${isMainItem ? 'hide-on-desktop' : ''}`}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {cat.name}
                      </NavLink>
                    );
                  })}
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

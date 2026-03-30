import './Header.css';
import { Link, NavLink } from 'react-router-dom';

export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="site-logo">Très Jolie</Link>
        <nav className="site-nav">
          <NavLink to="/clothing" className={({ isActive }) => isActive ? 'active-link' : ''}>Clothing</NavLink>
          <NavLink to="/jewelry" className={({ isActive }) => isActive ? 'active-link' : ''}>jewelry</NavLink>
          <Link to="/#featured">Featured</Link>
        </nav>
      </div>
    </header>
  );
}

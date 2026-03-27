import './Header.css';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="site-logo">Très Jolie</Link>
      <nav className="site-nav">
        <Link to="/clothing">Clothing</Link>
        <Link to="/jewelery">Jewelery</Link>
        <Link to="#featured">Featured</Link>
      </nav>
    </header>
  );
}

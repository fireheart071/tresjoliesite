import './Footer.css';
import { Link } from 'react-router-dom';
import { ALL_CATEGORIES } from '../constants/categories';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-logo">Très Jolie</p>
        <p className="footer-tagline">Clothing, Jewelry &amp; Bespoke Accessories — curated for you.</p>
        <div className="footer-links">
          {ALL_CATEGORIES.map(cat => (
            <Link key={cat.name} to={cat.path}>{cat.name}</Link>
          ))}
          <Link to="/#featured">Featured</Link>
        </div>
        <p className="footer-copy">&copy; {new Date().getFullYear()} Très Jolie. All rights reserved.</p>
      </div>
    </footer>
  );
}

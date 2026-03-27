import './Footer.css';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-logo">Très Jolie</p>
        <p className="footer-tagline">Clothing &amp; Jewelry — curated for you.</p>
        <div className="footer-links">
          <Link to="#clothing">Clothing</Link>
          <Link to="#jewelry">Jewelry</Link>
          <Link to="#featured">Featured</Link>
          <Link to="/admin">Admin</Link>
        </div>
        <p className="footer-copy">&copy; {new Date().getFullYear()} Très Jolie. All rights reserved.</p>
      </div>
    </footer>
  );
}

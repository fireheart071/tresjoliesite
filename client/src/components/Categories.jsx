import { Link } from 'react-router-dom';
import './Categories.css';

import { ALL_CATEGORIES } from '../constants/categories';

export function Categories() {
  return (
    <section className="categories" id="categories">
      <div className="categories-inner">
        <h2 className="categories-heading">Shop by category</h2>
        <div className="categories-grid">
          {ALL_CATEGORIES.map((cat) => (
            <Link key={cat.name} to={cat.path} className="category-card">
              <span className="category-label">{cat.name}</span>
              <p className="category-desc">{cat.description}</p>
              <span className="category-cta">{cat.cta}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

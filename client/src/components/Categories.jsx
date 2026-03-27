import './Categories.css';

const categories = [
  {
    id: 'clothing',
    title: 'Clothing',
    description: 'Timeless pieces for your wardrobe.',
    cta: 'Browse clothing',
  },
  {
    id: 'jewelry',
    title: 'Jewelry',
    description: 'Handpicked accessories to complete your look.',
    cta: 'Browse jewelry',
  },
];

export function Categories() {
  return (
    <section className="categories" id="categories">
      <div className="categories-inner">
        <h2 className="categories-heading">Shop by category</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <a key={cat.id} id={cat.id} href={`#${cat.id}`} className="category-card">
              <span className="category-label">{cat.title}</span>
              <p className="category-desc">{cat.description}</p>
              <span className="category-cta">{cat.cta}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

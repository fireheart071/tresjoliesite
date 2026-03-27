import './Featured.css';

import { useQuery } from '@tanstack/react-query';
import './Featured.css';

const fetchFeaturedProducts = async () => {
  const response = await fetch('http://localhost:5000/api/products?featured=true');
  if (!response.ok) throw new Error('Failed to fetch featured products');
  return response.json();
};

export function Featured() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: fetchFeaturedProducts
  });

  if (isLoading) return <div className="featured-loading">Loading featured pieces...</div>;
  if (error) return <div className="featured-error">Error: {error.message}</div>;

  return (
    <section className="featured" id="featured">
      <div className="featured-inner">
        <h2 className="featured-heading">Featured pieces</h2>
        <div className="featured-grid">
          {products.map((product) => (
            <article key={product._id} className="product-card">
              <div className="product-image">
                {product.image && <img src={product.image} alt={product.name} />}
              </div>
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <span className="product-price">{product.price}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

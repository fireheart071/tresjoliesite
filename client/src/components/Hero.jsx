import './Hero.css';

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <p className="hero-tagline">Clothing &amp; Jewelry</p>
        <h1 className="hero-title">Très Jolie</h1>
        <p className="hero-desc">Curated pieces for everyday elegance.</p>
        <a href="#featured" className="hero-cta">Shop the collection</a>
      </div>
    </section>
  );
}

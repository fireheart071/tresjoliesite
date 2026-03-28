import { useState } from 'react';
import './GalleryCard.css';

export function GalleryCard({ product }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showLightbox, setShowLightbox] = useState(false);
    const images = product.images || [];

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const toggleLightbox = () => {
        if (images.length > 0) {
            setShowLightbox(!showLightbox);
        }
    };

    return (
        <>
            <article className="product-card">
                <div className="product-image" onClick={toggleLightbox}>
                    {images.length > 0 ? (
                        <>
                            <img src={images[currentIndex]} alt={product.name} />
                            
                            {images.length > 1 && (
                                <div className="card-arrows">
                                    <button className="arrow-btn left" onClick={prevImage}>&larr;</button>
                                    <button className="arrow-btn right" onClick={nextImage}>&rarr;</button>
                                </div>
                            )}
                            
                            {images.length > 1 && (
                                <div className="image-dots">
                                    {images.map((_, i) => (
                                        <span key={i} className={`dot ${i === currentIndex ? 'active' : ''}`} />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="no-image">No Image</div>
                    )}
                </div>
                <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    <h3 className="product-name">{product.name}</h3>
                    <span className="product-price">{product.currency} {product.price}</span>
                </div>
            </article>

            {/* LIGHTBOX MODAL */}
            {showLightbox && (
                <div className="lightbox-overlay" onClick={toggleLightbox}>
                    <button className="close-lightbox" onClick={toggleLightbox}>&times;</button>
                    
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img src={images[currentIndex]} alt={product.name} className="lightbox-img" />
                        
                        {images.length > 1 && (
                            <>
                                <button className="lightbox-arrow left" onClick={prevImage}>&larr;</button>
                                <button className="lightbox-arrow right" onClick={nextImage}>&rarr;</button>
                            </>
                        )}

                        <div className="lightbox-info">
                            <h3>{product.name}</h3>
                            <p>{currentIndex + 1} / {images.length}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

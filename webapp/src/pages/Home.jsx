import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CtaButton from '../components/Button.jsx';
import { useHomeImages } from '../data/driveAPI.js';
import './Home.css';

function Hero() {
    const { images, loading } = useHomeImages();
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (images.length === 0) return;
        const id = setInterval(() => {
            setCurrent((c) => (c + 1) % images.length);
        }, 5000);
        return () => clearInterval(id);
    }, [images]);

    if (loading) return <section className="hero" />;

    const currentImage = images[current];
    const category = currentImage?.category || '';

    return (
        <section className="hero">
            {images.map((img, i) => (
                <div
                    key={img.id}
                    className={`hero__slide ${i === current ? 'hero__slide--active' : ''}`}
                    aria-hidden={i !== current}
                >
                    <img
                        src={img.src}
                        alt={img.title}
                        className="hero__slide-img"
                    />
                </div>
            ))}

            <div className="hero__overlay" />

            <div className="hero__content">
                <h1 key={current} className="hero__title">
                    {currentImage?.title}
                </h1>
                {category && (
                    <p key={`cat-${current}`} className="hero__subtitle">
                        {category}
                    </p>
                )}
            </div>

            <div className="hero__controls-right">
                {category && (
                    <CtaButton onClick={() => navigate(`/portfolio/${encodeURIComponent(category)}`)}>
                        Explore {category}
                    </CtaButton>
                )}

                <div className="hero__dots">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            className={`hero__dot ${i === current ? 'hero__dot--active' : ''}`}
                            onClick={() => setCurrent(i)}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function Home() {
    return (
        <div className="home">
            <Hero />
        </div>
    );
}
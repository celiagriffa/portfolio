import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CtaButton from "../components/Button.jsx";
import './Home.css';
import photo1 from '../data/images/mi-ami-2025/mi-ami-8.jpg';
import photo2 from '../data/images/chalk-2026/CHALK-14.jpg'
import photo3 from '../data/images/the-last-dinner-party-2026/TLDP-15.jpg';

/* ── Hero Slideshow ─────────────────────────────────── */

const localHeroImages = [
    { id: 1, src: photo1, title: 'Mi Ami Festival' },
    { id: 2, src: photo2, title: 'Chalk' },
    { id: 3, src: photo3, title: 'The Last Dinner Party' },
];

function Hero() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setCurrent((c) => (c + 1) % localHeroImages.length);
        }, 5000);
        return () => clearInterval(id);
    }, []);

    return (
        <section className="hero">
            {localHeroImages.map((img, i) => (
                <div
                    key={img.id}
                    className={`hero__slide ${i === current ? 'hero__slide--active' : ''}`}
                    style={{ backgroundImage: `url(${img.src})` }}
                    aria-hidden={i !== current}
                />
            ))}

            <div className="hero__overlay" />

            {/* Titolo Dinamico basato sulla nuova sorgente */}
            <div className="hero__content">
                <h1 key={current} className="hero__title">
                    {localHeroImages[current].title}
                </h1>
            </div>

            {/* Pulsante e Dots */}
            <div className="hero__controls-right">
                <CtaButton to="/portfolio">View Portfolio</CtaButton>

                <div className="hero__dots">
                    {localHeroImages.map((_, i) => (
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
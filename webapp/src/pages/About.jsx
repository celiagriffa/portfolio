import React, { useState } from 'react';
import './About.css';
import { useAboutImage } from '../data/driveAPI';

function About() {
    const { src, loading } = useAboutImage();
    const [imgLoaded, setImgLoaded] = useState(false);

    return (
        <div className="about-page fade-in">
            <div className="about-container">

                {/* Immagine — occupa sempre lo spazio, skeleton o foto */}
                <div className="about__image">
                    <div className={`about__image-skeleton ${imgLoaded ? 'about__image-skeleton--hidden' : ''}`} />
                    {src && (
                        <img
                            src={src}
                            alt="Celia Griffa - Photographer"
                            className={`about__img ${imgLoaded ? 'about__img--loaded' : ''}`}
                            onLoad={() => setImgLoaded(true)}
                        />
                    )}
                </div>

                {/* Testo Biografico */}
                <div className="about__text">
                    <span className="about__label">Behind the lens</span>
                    <h1 className="about__title">About</h1>

                    <div className="about__description">
                        <p>
                            Celia Griffa is a concert and studio photographer based in Milan, Italy.
                            Her work focuses on live music, capturing the raw atmosphere of concerts.
                            After learning the basics of photography during her bachelor's degree in Communication Design at Politecnico di Milano,
                            she has been developing her photography autonomously, working freelance or collaborating with various independent
                            magazines and other creatives.
                        </p>
                        <p>
                            Available for tours, festivals, editorial work, and studio sessions.
                        </p>
                    </div>

                    <div className="about__services">
                        <span className="service-item">Live Music</span>
                        <span className="service-item">Studio</span>
                        <span className="service-item">Editorial</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
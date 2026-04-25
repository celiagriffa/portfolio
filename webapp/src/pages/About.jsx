import React from 'react';
import './About.css';

function About() {
    return (
        <div className="about-page fade-in">
            <div className="about-container">
                {/* Immagine di Profilo / Backstage */}
                <div className="about__image">
                    {/*<img src="/img/celia-profile.jpg" alt="Celia Griffa - Photographer" />*/}
                </div>

                {/* Testo Biografico */}
                <div className="about__text">
                    <span className="about__label">Behind the lens</span>
                    <h1 className="about__title">About</h1>

                    <div className="about__description">
                        <p>
                            Celia Griffa is a concert and studio photographer based in Milan, Italy.
                            Her work focuses on live music, bold lighting, and intimate portraits.
                        </p>
                        <p>
                            Available for tours, festivals, editorial work, and studio sessions.
                            She captures the raw emotion and frozen time within every frame.
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
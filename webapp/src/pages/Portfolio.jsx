import React from 'react';
import { Link } from 'react-router-dom';
import { PROJECTS_DATA } from '../data/projects';
import './Portfolio.css';

function Portfolio() {
    return (
        <div className="portfolio-page">
            <div className="portfolio-list">
                {PROJECTS_DATA.map((project) => (
                    <Link to={`/portfolio/${project.id}`} key={project.id} className="project-item">

                        {/* Sinistra: Info del Progetto */}
                        <div className="project-info">
                            <h2 className="project-title">{project.title}</h2>
                            <div className="project-meta">
                                <span>{project.date}</span>
                                <span className="separator">—</span>
                                <span>{project.location}</span>
                            </div>
                        </div>

                        {/* Destra: Anteprima Immagini */}
                        <div className="project-preview-images">
                            {/* Assicurati che project.images esista, poi prendi le prime 3 */}
                            {project.thumbs && project.thumbs.slice(0, 5).map((imgSrc, index) => (
                                <img
                                    key={index}
                                    loading="lazy"
                                    src={imgSrc}
                                    alt={`${project.title} preview ${index + 1}`}
                                    className="preview-img"
                                />
                            ))}
                        </div>

                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Portfolio;
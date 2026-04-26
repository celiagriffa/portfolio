import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../data/driveApi';
import './Portfolio.css';

function SkeletonItem() {
    return (
        <div className="project-item skeleton-item">
            <div className="project-info">
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-meta" />
            </div>
            <div className="project-preview-images">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton skeleton-img" />
                ))}
            </div>
        </div>
    );
}

function PreviewImage({ src, alt }) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    if (error) return null;

    return (
        <div className="preview-img-wrapper">
            {!loaded && <div className="skeleton preview-img-skeleton" />}
            <img
                src={src}
                alt={alt}
                className="preview-img"
                style={{ opacity: loaded ? 1 : 0 }}  // ← opacity invece di display:none
                loading="lazy"
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
            />
        </div>
    );
}

function Portfolio() {
    const { projects, loading } = useProjects();

    return (
        <div className="portfolio-page">
            <div className="portfolio-list">
                {loading
                    ? [...Array(6)].map((_, i) => <SkeletonItem key={i} />)
                    : projects.map((project) => (
                        <Link to={`/portfolio/${project.id}`} key={project.id} className="project-item">
                            <div className="project-info">
                                <h2 className="project-title">{project.title}</h2>
                                <div className="project-meta">
                                    <span>{project.date}</span>
                                    <span className="separator">—</span>
                                    <span>{project.location}</span>
                                </div>
                            </div>
                            <div className="project-preview-images">
                                {project.thumbs && project.thumbs.slice(0, 5).map((imgSrc, index) => (
                                    <PreviewImage
                                        key={index}
                                        src={imgSrc}
                                        alt={`${project.title} preview ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    );
}

export default Portfolio;
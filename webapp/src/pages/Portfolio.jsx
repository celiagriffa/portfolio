import React, { useState, useEffect, useRef } from 'react';
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

/* Hook per rilevare se il device è touch/mobile */
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);
    return isMobile;
}

/* Singola riga del progetto con Intersection Observer su mobile */
function ProjectItem({ project, isMobile }) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isMobile) return; // Su desktop non serve l'observer
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
                else setIsVisible(false); // Si spegne uscendo dal viewport
            },
            { threshold: 0.35 } // Si attiva quando il 35% della riga è visibile
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [isMobile]);

    return (
        <Link
            ref={ref}
            to={`/portfolio/${project.id}`}
            className={`project-item ${isMobile && isVisible ? 'is-visible' : ''}`}
        >
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
    );
}

function Portfolio() {
    const { projects, loading } = useProjects();
    const isMobile = useIsMobile();

    return (
        <div className="portfolio-page">
            <div className="portfolio-list">
                {loading
                    ? [...Array(6)].map((_, i) => <SkeletonItem key={i} />)
                    : projects.map((project) => (
                        <ProjectItem key={project.id} project={project} isMobile={isMobile} />
                    ))
                }
            </div>
        </div>
    );
}

export default Portfolio;
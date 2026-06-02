import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProjectsByCategory } from '../data/driveAPI.js';
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
                style={{ opacity: loaded ? 1 : 0 }}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
            />
        </div>
    );
}

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

function ProjectItem({ project, isMobile, category }) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isMobile) return;
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
                else setIsVisible(false);
            },
            { threshold: 0.35 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [isMobile]);

    return (
        <Link
            ref={ref}
            to={`/portfolio/${encodeURIComponent(category)}/${project.id}`}
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
    const { category } = useParams();
    const categoryName = decodeURIComponent(category || '');
    const { projects, loading } = useProjectsByCategory(categoryName);
    const isMobile = useIsMobile();

    return (
        <div className="portfolio-page">
            <div className="portfolio-category-header">
                <h1 className="portfolio-category-title">{categoryName}</h1>
                <div className="portfolio-category-divider" />
            </div>

            <div className="portfolio-list">
                {loading
                    ? [...Array(6)].map((_, i) => <SkeletonItem key={i} />)
                    : projects.map((project) => (
                        <ProjectItem
                            key={project.id}
                            project={project}
                            isMobile={isMobile}
                            category={categoryName}
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default Portfolio;
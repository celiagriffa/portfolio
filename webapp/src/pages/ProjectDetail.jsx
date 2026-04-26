import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../data/driveApi';
import './ProjectDetail.css';

function LazyImage({ src, alt, priority = false }) {
    const ref = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const [inView, setInView] = useState(priority); // ← già "in view" se priority

    useEffect(() => {
        if (priority) return; // salta l'observer
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    obs.disconnect();
                }
            },
            { rootMargin: '200px' }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [priority]);

    return (
        <div ref={ref} className={`img-wrapper ${loaded ? 'img-wrapper--loaded' : ''}`}>
            {inView && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={() => setLoaded(true)}
                    loading={priority ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={priority ? 'high' : 'auto'}
                />
            )}
        </div>
    );
}

function SkeletonGallery() {
    const heights = [260, 380, 220, 340, 290, 410, 250, 320, 280];
    const cols = [0, 1, 2].map((col) =>
        heights.filter((_, i) => i % 3 === col)
    );

    return (
        <div className="gallery-container">
            <div className="gallery-header">
                <div className="skeleton skeleton-gallery-title" />
                <div className="skeleton skeleton-gallery-meta" />
            </div>
            <div className="masonry-grid">
                {cols.map((col, colIndex) => (
                    <div key={colIndex} className="masonry-col">
                        {col.map((h, i) => (
                            <div
                                key={i}
                                className="skeleton"
                                style={{ height: h, borderRadius: 0 }}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

function splitIntoColumns(images, count = 3) {
    const cols = Array.from({ length: count }, () => []);
    images.forEach((img, i) => cols[i % count].push({ src: img, index: i }));
    return cols;
}

function ProjectDetail() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { projects, loading } = useProjects();

    if (loading) return <SkeletonGallery />;

    const project = projects.find((p) => p.id === projectId);
    if (!project) return <div className="not-found">Project not found</div>;

    const columns = splitIntoColumns(project.images, 3);

    return (
        <div className="gallery-container">
            <button className="back-btn" onClick={() => navigate(-1)}>
                Back
            </button>

            <header className="gallery-header">
                <h1 className="gallery-title">{project.title}</h1>
                <span className="gallery-meta">{project.date} — {project.location}</span>
            </header>

            <div className="masonry-grid">
                {columns.map((col, colIndex) => (
                    <div key={colIndex} className="masonry-col">
                        {col.map(({ src, index }, rowIndex) => (
                            <LazyImage
                                key={index}
                                src={src}
                                alt={`${project.title} — ${index + 1}`}
                                priority={rowIndex === 0}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProjectDetail;
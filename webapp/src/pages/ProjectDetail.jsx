import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PROJECTS_DATA } from '../data/projects';
import './ProjectDetail.css';

// Carica l'immagine solo quando entra nel viewport
function LazyImage({ src, alt }) {
    const ref = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    obs.disconnect();
                }
            },
            { rootMargin: '200px' } // inizia a caricare 200px prima che sia visibile
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={ref} className={`img-wrapper ${loaded ? 'img-wrapper--loaded' : ''}`}>
            {inView && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={() => setLoaded(true)}
                    loading="lazy"
                    decoding="async"
                />
            )}
        </div>
    );
}

// Divide le immagini in 3 colonne bilanciate
function splitIntoColumns(images, count = 3) {
    const cols = Array.from({ length: count }, () => []);
    images.forEach((img, i) => cols[i % count].push({ src: img, index: i }));
    return cols;
}

function ProjectDetail() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const project = PROJECTS_DATA.find((p) => p.id === projectId);
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
                        {col.map(({ src, index }) => (
                            <LazyImage
                                key={index}
                                src={src}
                                alt={`${project.title} — ${index + 1}`}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProjectDetail;
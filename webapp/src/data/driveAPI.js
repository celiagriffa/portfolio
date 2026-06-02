const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const ROOT_FOLDER_ID = import.meta.env.VITE_DRIVE_ROOT_FOLDER_ID;

import { useState, useEffect } from 'react';

const driveUrl = (query, fields) =>
    `https://www.googleapis.com/drive/v3/files?` +
    `q=${encodeURIComponent(query)}&key=${API_KEY}&fields=${encodeURIComponent(fields)}`;

const listChildren = async (folderId, mimeType = null) => {
    let q = `'${folderId}' in parents and trashed = false`;
    if (mimeType) q += ` and mimeType = '${mimeType}'`;
    const res = await fetch(driveUrl(q, 'files(id,name,mimeType)'));
    const data = await res.json();
    return data.files || [];
};

const MONTH_ORDER = {
    January: 0, February: 1, March: 2, April: 3,
    May: 4, June: 5, July: 6, August: 7,
    September: 8, October: 9, November: 10, December: 11,
};

const parseProjectName = (folderName) => {
    const parts = folderName.split(' - ');
    const dateStr = parts[1]?.trim() || '';
    const [first, second] = dateStr.split(' ');
    const hasMonth = first in MONTH_ORDER;

    return {
        title: parts[0]?.trim() || folderName,
        date: dateStr,
        month: hasMonth ? first : '',
        year: hasMonth ? (second ? parseInt(second, 10) : 0) : (first ? parseInt(first, 10) : 0),
        monthIndex: hasMonth ? MONTH_ORDER[first] : -1,
        location: parts[2]?.trim() || '',
    };
};

export const thumbUrl = (fileId) =>
    `https://lh3.googleusercontent.com/d/${fileId}`;

const loadProjectsFromFolder = async (folderId, categoryName) => {
    const projectFolders = await listChildren(folderId, 'application/vnd.google-apps.folder');

    const projects = await Promise.all(
        projectFolders.map(async (folder) => {
            const children = await listChildren(folder.id);
            const imagesFolder = children.find((f) => f.name === 'images');
            const thumbsFolder = children.find((f) => f.name === 'thumbs');
            const info = parseProjectName(folder.name);

            const imageFiles = imagesFolder ? await listChildren(imagesFolder.id) : [];
            const thumbFiles = thumbsFolder ? await listChildren(thumbsFolder.id) : [];

            return {
                id: folder.id,
                folderName: folder.name,
                category: categoryName,
                title: info.title,
                date: info.date,
                year: info.year,
                monthIndex: info.monthIndex,
                location: info.location,
                images: imageFiles.map((f) => thumbUrl(f.id)),
                thumbs: thumbFiles.map((f) => thumbUrl(f.id)),
            };
        })
    );

    return projects.sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return b.monthIndex - a.monthIndex;
    });
};

export const loadCategories = async () => {
    const rootContent = await listChildren(ROOT_FOLDER_ID, 'application/vnd.google-apps.folder');
    const workFolder = rootContent.find(f => f.name === 'Work');
    if (!workFolder) return [];

    const categoryFolders = await listChildren(workFolder.id, 'application/vnd.google-apps.folder');
    return categoryFolders.map(f => ({ id: f.id, name: f.name }));
};

export const loadProjects = async () => {
    const rootContent = await listChildren(ROOT_FOLDER_ID, 'application/vnd.google-apps.folder');
    const workFolder = rootContent.find(f => f.name === 'Work');
    if (!workFolder) return [];

    const categoryFolders = await listChildren(workFolder.id, 'application/vnd.google-apps.folder');
    const allProjects = await Promise.all(
        categoryFolders.map(cat => loadProjectsFromFolder(cat.id, cat.name))
    );

    return allProjects.flat();
};

export const loadProjectsByCategory = async (categoryName) => {
    const rootContent = await listChildren(ROOT_FOLDER_ID, 'application/vnd.google-apps.folder');
    const workFolder = rootContent.find(f => f.name === 'Work');
    if (!workFolder) return [];

    const categoryFolders = await listChildren(workFolder.id, 'application/vnd.google-apps.folder');
    const categoryFolder = categoryFolders.find(f => f.name === categoryName);
    if (!categoryFolder) return [];

    return loadProjectsFromFolder(categoryFolder.id, categoryName);
};

export function useProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cached = sessionStorage.getItem('projects');
        if (cached) {
            setProjects(JSON.parse(cached));
            setLoading(false);
            return;
        }

        loadProjects().then((data) => {
            setProjects(data);
            sessionStorage.setItem('projects', JSON.stringify(data));
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    return { projects, loading };
}

export function useProjectsByCategory(categoryName) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!categoryName) return;

        const cacheKey = `projects_${categoryName}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
            setProjects(JSON.parse(cached));
            setLoading(false);
            return;
        }

        loadProjectsByCategory(categoryName).then((data) => {
            setProjects(data);
            sessionStorage.setItem(cacheKey, JSON.stringify(data));
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, [categoryName]);

    return { projects, loading };
}

export function useCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cached = sessionStorage.getItem('categories');
        if (cached) {
            setCategories(JSON.parse(cached));
            setLoading(false);
            return;
        }

        loadCategories().then((data) => {
            setCategories(data);
            sessionStorage.setItem('categories', JSON.stringify(data));
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    return { categories, loading };
}

export const loadHomeImages = async () => {
    const folders = await listChildren(ROOT_FOLDER_ID, 'application/vnd.google-apps.folder');
    const homeFolder = folders.find((f) => f.name === 'Home');
    if (!homeFolder) return [];

    const files = await listChildren(homeFolder.id);

    return files
        .map((f) => {
            const nameWithoutExt = f.name.replace(/\.[^/.]+$/, '');
            // Formato atteso: "1 - Categoria - Titolo"
            const parts = nameWithoutExt.split(' - ');
            const order = parts[0] ? parseInt(parts[0].trim(), 10) : Infinity;
            const category = parts[1]?.trim() || '';
            const title = parts[2]?.trim() || parts[1]?.trim() || nameWithoutExt;

            return {
                id: f.id,
                src: thumbUrl(f.id),
                title,
                category,
                order: isNaN(order) ? Infinity : order,
            };
        })
        .sort((a, b) => a.order - b.order);
};

export function useHomeImages() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cached = sessionStorage.getItem('homeImages');
        if (cached) {
            setImages(JSON.parse(cached));
            setLoading(false);
            return;
        }

        loadHomeImages().then((data) => {
            setImages(data);
            sessionStorage.setItem('homeImages', JSON.stringify(data));
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    return { images, loading };
}

export const loadAboutImage = async () => {
    const folders = await listChildren(ROOT_FOLDER_ID, 'application/vnd.google-apps.folder');
    const aboutFolder = folders.find((f) => f.name === 'About');
    if (!aboutFolder) return null;

    const files = await listChildren(aboutFolder.id);
    if (!files.length) return null;

    return thumbUrl(files[0].id);
};

export function useAboutImage() {
    const [src, setSrc] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cached = sessionStorage.getItem('aboutImage');
        if (cached) {
            setSrc(cached);
            setLoading(false);
            return;
        }

        loadAboutImage().then((url) => {
            if (url) {
                setSrc(url);
                sessionStorage.setItem('aboutImage', url);
            }
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    return { src, loading };
}
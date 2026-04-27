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

    // Controlla se la prima parola è un mese conosciuto
    const [first, second] = dateStr.split(' ');
    const hasMonth = first in MONTH_ORDER;

    return {
        title: parts[0]?.trim() || folderName,
        date: dateStr,
        month: hasMonth ? first : '',
        year: hasMonth ? (second ? parseInt(second, 10) : 0) : (first ? parseInt(first, 10) : 0),
        monthIndex: hasMonth ? MONTH_ORDER[first] : -1, // -1 = mese assente, va in fondo
        location: parts[2]?.trim() || '',
    };
};

export const thumbUrl = (fileId) =>
    `https://lh3.googleusercontent.com/d/${fileId}`;

export const loadProjects = async () => {
    const rootContent = await listChildren(
        ROOT_FOLDER_ID,
        'application/vnd.google-apps.folder'
    );

    console.log('Cartelle nella root:', rootContent);

    const workFolder = rootContent.find(f => f.name === 'Work');

    if (!workFolder) {
        console.error('Cartella "Work" non trovata nella Root');
        return [];
    }

    console.log('Work folder trovata:', workFolder);

    const projectFolders = await listChildren(
        workFolder.id,
        'application/vnd.google-apps.folder'
    );

    console.log('Progetti dentro Work:', projectFolders);

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
                title: info.title,
                date: info.date,
                location: info.location,
                images: imageFiles.map((f) => thumbUrl(f.id, 1200)),
                thumbs: thumbFiles.map((f) => thumbUrl(f.id, 400)),
            };
        })
    );

    return projects.sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return b.monthIndex - a.monthIndex;
    });
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
        }).catch(() => {          // ← manca questo
            setLoading(false);    // altrimenti lo spinner non finisce mai
        });
    }, []);

    return { projects, loading };
}

export const loadHomeImages = async () => {
    const folders = await listChildren(
        ROOT_FOLDER_ID,
        'application/vnd.google-apps.folder'
    );

    const homeFolder = folders.find((f) => f.name === 'Home');
    if (!homeFolder) {
        console.error('Package "Home" not found');
        return [];
    }

    const files = await listChildren(homeFolder.id);

    return files
        .map((f) => {
            const nameWithoutExt = f.name.replace(/\.[^/.]+$/, '');
            const match = nameWithoutExt.match(/^(\d+)\s*-\s*(.+)$/);
            return {
                id: f.id,
                src: thumbUrl(f.id, 1920),
                title: match ? match[2].trim() : nameWithoutExt,
                order: match ? parseInt(match[1], 10) : Infinity,
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
            const parsed = JSON.parse(cached);
            console.log('Home images (from cache):', parsed);
            setImages(parsed);
            setLoading(false);
            return;
        }

        loadHomeImages().then((data) => {
            console.log('Home images (from Drive):', data);
            setImages(data);
            sessionStorage.setItem('homeImages', JSON.stringify(data));
            setLoading(false);
        }).catch(() => {          // ← manca questo
            setLoading(false);    // altrimenti lo spinner non finisce mai
        });
    }, []);

    return { images, loading };
}
export const loadAboutImage = async () => {
    const folders = await listChildren(
        ROOT_FOLDER_ID,
        'application/vnd.google-apps.folder'
    );

    const aboutFolder = folders.find((f) => f.name === 'About');
    if (!aboutFolder) {
        console.error('Cartella "About" non trovata nella Root');
        return null;
    }

    const files = await listChildren(aboutFolder.id);
    if (!files.length) return null;

    // Prende la prima (e unica) foto
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
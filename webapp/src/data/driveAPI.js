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

const parseProjectName = (folderName) => {
    const parts = folderName.split(' - ');
    return {
        title: parts[0]?.trim() || folderName,
        date: parts[1]?.trim() || '',
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

    return projects.sort((a, b) => b.date.localeCompare(a.date));
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

    return files.map((f) => ({
        id: f.id,
        src: thumbUrl(f.id, 1920),
        // Rimuove l'estensione dal nome: "Mi Ami Festival.jpg" → "Mi Ami Festival"
        title: f.name.replace(/\.[^/.]+$/, ''),
    }));
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
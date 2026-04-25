const allImages = import.meta.glob('./images/**/*.{jpg,jpeg,png,webp}', { eager: true });

const getProjectImages = (folderName) => {
    return Object.keys(allImages)
        .filter((path) => path.includes(`/images/${folderName}/`))
        .map((path) => allImages[path].default);
};

const getThumbnails = (folderName) => {
    return Object.keys(allImages)
        .filter((path) => path.includes(`/images/thumbs/${folderName}/`))
        .map((path) => allImages[path].default);
};

export const PROJECTS_DATA = [
    {
        id: 'bw-1-2025',
        title: 'BW 1',
        date: '2025',
        location: 'Milano, IT',
        images: getProjectImages('bw-1-2025'),
        thumbs: getThumbnails('bw-1-2025'),
    },
    {
        id: 'bw-2-2025',
        title: 'BW 2',
        date: '2025',
        location: 'Milano, IT',
        images: getProjectImages('bw-2-2025'),
        thumbs: getThumbnails('bw-2-2025'),
    },
    {
        id: 'chalk-2026',
        title: 'Chalk',
        date: '2026',
        location: 'Milano, IT',
        images: getProjectImages('chalk-2026'),
        thumbs: getThumbnails('chalk-2026'),
    },
    {
        id: 'phoneboy-2025',
        title: 'Phoneboy',
        date: '2025',
        location: 'Milano, IT',
        images: getProjectImages('phoneboy-2025'),
        thumbs: getThumbnails('phoneboy-2025'),
    },
    {
        id: 'plant-2025',
        title: 'Plant',
        date: '2025',
        location: 'Milano, IT',
        images: getProjectImages('plant-2025'),
        thumbs: getThumbnails('plant-2025'),
    },
    {
        id: 'the-happy-fits-2025',
        title: 'The Happy Fits',
        date: '2025',
        location: 'Milano, IT',
        images: getProjectImages('the-happy-fits-2025'),
        thumbs: getThumbnails('the-happy-fits-2025'),
    },
    {
        id: 'the-last-dinner-party-2025',
        title: 'The Last Dinner Party',
        date: '2025',
        location: 'Milano, IT',
        images: getProjectImages('the-last-dinner-party-2026'),
        thumbs: getThumbnails('the-last-dinner-party-2026'),
    },
    {
        id: 'the-meffs-2025',
        title: 'The Meffs',
        date: '2025',
        location: 'Milano, IT',
        images: getProjectImages('the-meffs-2025'),
        thumbs: getThumbnails('the-meffs-2025'),
    },
    {
        id: 'y2k-2025',
        title: 'Y2K',
        date: '2025',
        location: 'Milano, IT',
        images: getProjectImages('y2k-2025'),
        thumbs: getThumbnails('y2k-2025'),
    },
];
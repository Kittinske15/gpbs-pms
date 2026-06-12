import { apiGet, API_BASE_URL } from './api';

// Cache for custom profile photos (shared across all components)
let cachedPhotos = null;
let fetchPromise = null;

// Fetch all custom profile photos (cached - only fetches once per session)
export const fetchCustomPhotos = () => {
    if (cachedPhotos) return Promise.resolve(cachedPhotos);
    if (fetchPromise) return fetchPromise;

    fetchPromise = apiGet('/profile/photos/all')
        .then(data => {
            cachedPhotos = data.photos || {};
            return cachedPhotos;
        })
        .catch(() => {
            cachedPhotos = {};
            return cachedPhotos;
        });

    return fetchPromise;
};

// Clear cache (call after uploading a new photo)
export const clearPhotoCache = () => {
    cachedPhotos = null;
    fetchPromise = null;
};

// Get the photo URL for a member - checks custom upload first, then ibsdo.com
export const getMemberPhotoUrl = (empId, customPhotos) => {
    if (customPhotos && customPhotos[empId]) {
        return `${API_BASE_URL}/uploads/profiles/${customPhotos[empId]}`;
    }
    return `https://ibsdo.com/tvs/ltvs/emp_pic/${empId}.jpg`;
};

// Photo error handler - fallback chain: custom -> TVS -> BSDO -> default
export const handlePhotoError = (e, empId) => {
    const bsdoUrl = `https://ibsdo.com/bsdo/emp_pic/${empId}.jpg`;
    const defaultUrl = process.env.PUBLIC_URL + '/assets/project-owner.jpg';

    if (e.target.src.includes('/tvs/')) {
        e.target.src = bsdoUrl;
    } else if (!e.target.src.includes('project-owner')) {
        e.target.src = defaultUrl;
    }
};
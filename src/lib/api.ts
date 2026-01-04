import axios from 'axios';

const api = axios.create({
    baseURL: 'https://adhithya-electronics-api.onrender.com',
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;

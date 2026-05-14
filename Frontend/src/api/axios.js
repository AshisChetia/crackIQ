import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api',
    withCredentials: true
});

// Add a request interceptor to attach the JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration (401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error(`Unauthorized access to ${error.config.url}. Status: 401. Data:`, error.response.data);
            
            // Only redirect if it's not the login page itself and we have a token that failed
            const token = localStorage.getItem("token");
            if (token && window.location.pathname !== '/login') {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                // Redirect to login if unauthorized
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
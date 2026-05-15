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
            const token = localStorage.getItem("token");
            const isLoginPage = window.location.pathname === '/login';
            
            // Only handle 401 if we actually have a token and aren't already trying to login
            if (token && !isLoginPage) {
                console.warn("Session expired or invalid token. Cleaning up...");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                
                // Redirect to login with a message
                window.location.href = "/login?expired=true";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
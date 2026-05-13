import axios from 'axios';
import dotenv from "dotenv"

dotenv.config()

const api = axios.create({
    baseURL: process.env.BASE_URL,
    withCredentials: true
});

// Add a request interceptor to attach the JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if(token) {
            config.headers.Authorization = `Bearer ${token}`; // Fixed typo: 'tokken' -> 'token'
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
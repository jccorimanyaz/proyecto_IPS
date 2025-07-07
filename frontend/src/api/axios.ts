import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000/",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers.Authorization = `JWT ${token}`;
    }
    return config;
});

export default API;
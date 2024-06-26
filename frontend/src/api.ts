import axios from "axios";

const api = axios.create({
    // baseURL: "http://localhost:8000",
    baseURL: "https://development-challenge-nine-backend.onrender.com"
})

export default api;
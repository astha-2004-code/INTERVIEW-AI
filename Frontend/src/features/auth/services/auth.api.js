import axios from "axios"

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return "";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function register({ username, email, password }) {
    const response = await api.post('/api/auth/register', { username, email, password })
    if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token)
    }
    return response.data
}

export async function login({ email, password }) {
    const response = await api.post("/api/auth/login", { email, password })
    if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token)
    }
    return response.data
}

export async function logout() {
    try {
        const response = await api.get("/api/auth/logout")
        localStorage.removeItem("token")
        return response.data
    } catch (err) {
        localStorage.removeItem("token")
        throw err
    }
}

export async function getMe() {
    const response = await api.get("/api/auth/get-me")
    return response.data
}
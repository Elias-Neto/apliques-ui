import axios from "axios"

const apiURL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: apiURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar o token automaticamente em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para lidar com erros de resposta
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Se receber erro 401 (Unauthorized), limpa o token e redireciona para login
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      
      // Redireciona para login apenas se não estiver já na página de login
      if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
        window.location.href = "/login"
      }
    }
    
    return Promise.reject(error)
  }
)

export { api }

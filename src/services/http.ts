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
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
        window.location.href = "/login"
      }
    }

    if (
      error.response?.status === 402 &&
      error.response?.data?.code === 'TenantSuspended' &&
      window.location.pathname !== "/minha-mensalidade"
    ) {
      window.location.href = "/minha-mensalidade"
    }

    return Promise.reject(error)
  }
)

export { api }

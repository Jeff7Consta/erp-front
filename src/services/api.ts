import axios from "axios";
import { toast } from "@/hooks/use-toast";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://18.233.124.211:5200/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Adiciona o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepta erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Ocorreu um erro na requisição";

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (error.response?.status !== 401) {
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
    }

    return Promise.reject(error);
  }
);

export const getMenusByUser = async () => {
  const response = await api.get("/menus-usuario");
  return response.data;
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { loginUser, logoutUser, checkAuthStatus } from "@/services/auth";

interface User {
  id: number;
  nome: string;
  email: string;
}

interface LoginResponse {
  token: string;
  usuario: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const userData = await checkAuthStatus() as User;
          setUser(userData);
        } catch (error) {
          setToken(null);
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await loginUser(email, password) as LoginResponse;
      
      localStorage.setItem("token", response.token);
      setToken(response.token);
      setUser(response.usuario);
      
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${response.usuario.nome}!`,
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
    
      toast({
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais e tente novamente"
        //variant: "destructive",
      });
    
      throw error;
    }

    finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast({
      title: "Logout realizado com sucesso",
    });
    navigate("/login");
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { getMenusByUser } from "@/services/api";

export interface MenuItem {
  id: number;
  nome: string;
  rota: string;
  icone: string;
  paiId: number | null;
  ordem: number;
  filhos?: MenuItem[];
}

interface MenuContextType {
  menus: MenuItem[];
  isLoading: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rawMenus, setRawMenus] = useState<MenuItem[]>([]);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    const fetchMenus = async () => {
      if (isAuthenticated && token) {
        try {
          setIsLoading(true);
          const menusData = await getMenusByUser();
          setRawMenus(menusData);
        } catch (error) {
          console.error("Error fetching menus:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMenus();
  }, [isAuthenticated, token]);

  useEffect(() => {
    // Organize menus into a hierarchical structure
    const buildMenuTree = (items: MenuItem[], parentId: number | null = null): MenuItem[] => {
      return items
        .filter(item => item.paiId === parentId)
        .sort((a, b) => a.ordem - b.ordem)
        .map(item => ({
          ...item,
          filhos: buildMenuTree(items, item.id)
        }));
    };

    const organizedMenus = buildMenuTree(rawMenus);
    setMenus(organizedMenus);
  }, [rawMenus]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <MenuContext.Provider value={{ menus, isLoading, isSidebarOpen, toggleSidebar }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};


import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import Table from "@/components/Table";
import { Button } from "@/components/ui/button";
import MenuForm from "./MenuForm";
import { getMenus, deleteMenu } from "@/services/api";

// Mock data for development
const mockMenus = [
  { id: 1, nome: "Dashboard", rota: "/dashboard", icone: "home", paiId: null, ordem: 1 },
  { id: 2, nome: "Administração", rota: "", icone: "settings", paiId: null, ordem: 2 },
  { id: 3, nome: "Usuários", rota: "/usuarios", icone: "user", paiId: 2, ordem: 1 },
  { id: 4, nome: "Grupos", rota: "/grupos", icone: "users", paiId: 2, ordem: 2 },
  { id: 5, nome: "Níveis de Acesso", rota: "/niveis-acesso", icone: "shield", paiId: 2, ordem: 3 },
  { id: 6, nome: "Menus", rota: "/menus", icone: "menu", paiId: 2, ordem: 4 },
  { id: 7, nome: "Permissões", rota: "/permissoes", icone: "lock", paiId: 2, ordem: 5 },
  { id: 8, nome: "Relatórios", rota: "", icone: "bar-chart", paiId: null, ordem: 3 },
  { id: 9, nome: "Power BI", rota: "/relatorios-powerbi", icone: "pie-chart", paiId: 8, ordem: 1 },
  { id: 10, nome: "SQL", rota: "/relatorios-sql", icone: "database", paiId: 8, ordem: 2 },
];

interface Menu {
  id: number;
  nome: string;
  rota: string;
  icone: string;
  paiId: number | null;
  ordem: number;
  paiNome?: string;
}

const Menus = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<Menu | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        // In a real app, we would use this:
        // const data = await getMenus();
        
        // For development, use mock data and add parent name
        const menusWithParentName = mockMenus.map(menu => {
          if (menu.paiId === null) {
            return { ...menu, paiNome: "Nenhum" };
          }
          const parentMenu = mockMenus.find(m => m.id === menu.paiId);
          return { ...menu, paiNome: parentMenu ? parentMenu.nome : "Nenhum" };
        });
        
        setMenus(menusWithParentName);
      } catch (error) {
        console.error("Error fetching menus:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os menus",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  const handleAddMenu = () => {
    setCurrentMenu(null);
    setIsFormOpen(true);
  };

  const handleEditMenu = (menu: Menu) => {
    setCurrentMenu(menu);
    setIsFormOpen(true);
  };

  const handleDeleteMenu = (menu: Menu) => {
    // Check if menu has children
    const hasChildren = menus.some(m => m.paiId === menu.id);
    if (hasChildren) {
      toast({
        title: "Não é possível excluir",
        description: "Este menu possui submenus. Remova os submenus antes de excluí-lo.",
        variant: "destructive",
      });
      return;
    }
    
    setMenuToDelete(menu);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!menuToDelete) return;
    
    try {
      // In a real app, we would use this:
      // await deleteMenu(menuToDelete.id);
      
      // For development, update local state
      setMenus(menus.filter(menu => menu.id !== menuToDelete.id));
      
      toast({
        title: "Menu excluído",
        description: `${menuToDelete.nome} foi excluído com sucesso.`,
      });
    } catch (error) {
      console.error("Error deleting menu:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o menu",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setMenuToDelete(null);
    }
  };

  const handleFormSubmit = (menuData: any) => {
    if (currentMenu) {
      // Edit existing menu
      const updatedMenus = menus.map(menu => {
        if (menu.id === currentMenu.id) {
          const parentMenu = menus.find(m => m.id === Number(menuData.paiId) || null);
          return { 
            ...menu, 
            ...menuData,
            paiId: menuData.paiId ? Number(menuData.paiId) : null,
            ordem: Number(menuData.ordem),
            paiNome: parentMenu ? parentMenu.nome : "Nenhum" 
          };
        }
        return menu;
      });
      setMenus(updatedMenus);
      toast({
        title: "Menu atualizado",
        description: `${menuData.nome} foi atualizado com sucesso.`,
      });
    } else {
      // Add new menu
      const parentMenu = menus.find(m => m.id === Number(menuData.paiId) || null);
      const newMenu = {
        id: menus.length > 0 ? Math.max(...menus.map(m => m.id)) + 1 : 1,
        ...menuData,
        paiId: menuData.paiId ? Number(menuData.paiId) : null,
        ordem: Number(menuData.ordem),
        paiNome: parentMenu ? parentMenu.nome : "Nenhum"
      };
      setMenus([...menus, newMenu]);
      toast({
        title: "Menu criado",
        description: `${menuData.nome} foi criado com sucesso.`,
      });
    }
    setIsFormOpen(false);
  };

  const columns = [
    { key: "id", header: "ID" },
    { key: "nome", header: "Nome" },
    { key: "rota", header: "Rota" },
    { key: "icone", header: "Ícone" },
    { key: "paiNome", header: "Menu Pai" },
    { key: "ordem", header: "Ordem" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          Menus
        </motion.h1>
        <Button onClick={handleAddMenu}>Adicionar Menu</Button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Table
          data={menus}
          columns={columns}
          actions={{
            edit: {
              onClick: handleEditMenu,
            },
            delete: {
              onClick: handleDeleteMenu,
            },
          }}
          onAdd={handleAddMenu}
          exportable={true}
        />
      </motion.div>

      {isFormOpen && (
        <MenuForm
          menu={currentMenu}
          parentMenus={menus.filter(m => m.rota === "" || m.rota === "#")}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o menu {menuToDelete?.nome}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Menus;

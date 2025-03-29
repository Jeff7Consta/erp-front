
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
import PermissionForm from "./PermissionForm";
import { getPermissions, deletePermission } from "@/services/api";

// Mock data for development
const mockPermissions = [
  { id: 1, menuId: 1, menuNome: "Dashboard", grupoId: 1, grupoNome: "Administradores", nivelAcessoId: 4, nivelAcessoNome: "Administração" },
  { id: 2, menuId: 3, menuNome: "Usuários", grupoId: 1, grupoNome: "Administradores", nivelAcessoId: 4, nivelAcessoNome: "Administração" },
  { id: 3, menuId: 4, menuNome: "Grupos", grupoId: 1, grupoNome: "Administradores", nivelAcessoId: 4, nivelAcessoNome: "Administração" },
  { id: 4, menuId: 1, menuNome: "Dashboard", grupoId: 2, grupoNome: "Usuários", nivelAcessoId: 1, nivelAcessoNome: "Leitura" },
  { id: 5, menuId: 9, menuNome: "Power BI", grupoId: 3, grupoNome: "Financeiro", nivelAcessoId: 2, nivelAcessoNome: "Escrita" },
  { id: 6, menuId: 10, menuNome: "SQL", grupoId: 3, grupoNome: "Financeiro", nivelAcessoId: 1, nivelAcessoNome: "Leitura" },
];

interface Permission {
  id: number;
  menuId: number;
  menuNome: string;
  grupoId: number;
  grupoNome: string;
  nivelAcessoId: number;
  nivelAcessoNome: string;
}

const Permissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPermission, setCurrentPermission] = useState<Permission | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        // In a real app, we would use this:
        // const data = await getPermissions();
        // setPermissions(data);
        
        // For development, use mock data
        setPermissions(mockPermissions);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as permissões",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const handleAddPermission = () => {
    setCurrentPermission(null);
    setIsFormOpen(true);
  };

  const handleEditPermission = (permission: Permission) => {
    setCurrentPermission(permission);
    setIsFormOpen(true);
  };

  const handleDeletePermission = (permission: Permission) => {
    setPermissionToDelete(permission);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!permissionToDelete) return;
    
    try {
      // In a real app, we would use this:
      // await deletePermission(permissionToDelete.id);
      
      // For development, update local state
      setPermissions(permissions.filter(permission => permission.id !== permissionToDelete.id));
      
      toast({
        title: "Permissão excluída",
        description: "A permissão foi excluída com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting permission:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a permissão",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPermissionToDelete(null);
    }
  };

  const handleFormSubmit = (permissionData: any) => {
    // Mock menu, group, and access level names for development
    const mockMenus = [
      { id: 1, nome: "Dashboard" },
      { id: 3, nome: "Usuários" },
      { id: 4, nome: "Grupos" },
      { id: 9, nome: "Power BI" },
      { id: 10, nome: "SQL" },
    ];
    const mockGroups = [
      { id: 1, nome: "Administradores" },
      { id: 2, nome: "Usuários" },
      { id: 3, nome: "Financeiro" },
    ];
    const mockAccessLevels = [
      { id: 1, nome: "Leitura" },
      { id: 2, nome: "Escrita" },
      { id: 3, nome: "Exclusão" },
      { id: 4, nome: "Administração" },
    ];
    
    const menuId = Number(permissionData.menuId);
    const grupoId = Number(permissionData.grupoId);
    const nivelAcessoId = Number(permissionData.nivelAcessoId);
    
    const menu = mockMenus.find(m => m.id === menuId);
    const grupo = mockGroups.find(g => g.id === grupoId);
    const nivelAcesso = mockAccessLevels.find(n => n.id === nivelAcessoId);
    
    if (!menu || !grupo || !nivelAcesso) {
      toast({
        title: "Erro",
        description: "Dados inválidos para a permissão",
        variant: "destructive",
      });
      return;
    }
    
    if (currentPermission) {
      // Edit existing permission
      const updatedPermissions = permissions.map(permission => 
        permission.id === currentPermission.id ? {
          ...permission,
          menuId,
          menuNome: menu.nome,
          grupoId,
          grupoNome: grupo.nome,
          nivelAcessoId,
          nivelAcessoNome: nivelAcesso.nome,
        } : permission
      );
      setPermissions(updatedPermissions);
      toast({
        title: "Permissão atualizada",
        description: "A permissão foi atualizada com sucesso.",
      });
    } else {
      // Check if permission already exists
      const permissionExists = permissions.some(
        p => p.menuId === menuId && p.grupoId === grupoId
      );
      
      if (permissionExists) {
        toast({
          title: "Permissão duplicada",
          description: "Já existe uma permissão para este menu e grupo.",
          variant: "destructive",
        });
        return;
      }
      
      // Add new permission
      const newPermission = {
        id: permissions.length > 0 ? Math.max(...permissions.map(p => p.id)) + 1 : 1,
        menuId,
        menuNome: menu.nome,
        grupoId,
        grupoNome: grupo.nome,
        nivelAcessoId,
        nivelAcessoNome: nivelAcesso.nome,
      };
      setPermissions([...permissions, newPermission]);
      toast({
        title: "Permissão criada",
        description: "A permissão foi criada com sucesso.",
      });
    }
    setIsFormOpen(false);
  };

  const columns = [
    { key: "id", header: "ID" },
    { key: "menuNome", header: "Menu" },
    { key: "grupoNome", header: "Grupo" },
    { 
      key: "nivelAcessoNome", 
      header: "Nível de Acesso",
      render: (value: string) => {
        let color = "bg-blue-100 text-blue-800";
        
        if (value === "Leitura") color = "bg-green-100 text-green-800";
        if (value === "Escrita") color = "bg-blue-100 text-blue-800";
        if (value === "Exclusão") color = "bg-orange-100 text-orange-800";
        if (value === "Administração") color = "bg-purple-100 text-purple-800";
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${color}`}>
            {value}
          </span>
        );
      }
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          Permissões
        </motion.h1>
        <Button onClick={handleAddPermission}>Adicionar Permissão</Button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Table
          data={permissions}
          columns={columns}
          actions={{
            edit: {
              onClick: handleEditPermission,
            },
            delete: {
              onClick: handleDeletePermission,
            },
          }}
          onAdd={handleAddPermission}
          exportable={true}
        />
      </motion.div>

      {isFormOpen && (
        <PermissionForm
          permission={currentPermission}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta permissão? Esta ação não pode ser desfeita.
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

export default Permissions;

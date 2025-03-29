
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import UserForm from "./UserForm";
import { getUsers, deleteUser } from "@/services/api";

// Mock data for development
const mockUsers = [
  { id: 1, nome: "Admin", email: "admin@empresa.com", ativo: true, grupos: ["Administradores"] },
  { id: 2, nome: "João Silva", email: "joao@empresa.com", ativo: true, grupos: ["Usuários", "Financeiro"] },
  { id: 3, nome: "Maria Santos", email: "maria@empresa.com", ativo: true, grupos: ["Usuários"] },
  { id: 4, nome: "Pedro Oliveira", email: "pedro@empresa.com", ativo: false, grupos: ["Usuários"] },
  { id: 5, nome: "Ana Costa", email: "ana@empresa.com", ativo: true, grupos: ["Usuários", "RH"] },
];

interface User {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  grupos: string[];
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // In a real app, we would use this:
        // const data = await getUsers();
        // setUsers(data);
        
        // For development, use mock data
        setUsers(mockUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os usuários",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setCurrentUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      // In a real app, we would use this:
      // await deleteUser(userToDelete.id);
      
      // For development, update local state
      setUsers(users.filter(user => user.id !== userToDelete.id));
      
      toast({
        title: "Usuário excluído",
        description: `${userToDelete.nome} foi excluído com sucesso.`,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o usuário",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleFormSubmit = (userData: any) => {
    if (currentUser) {
      // Edit existing user
      const updatedUsers = users.map(user => 
        user.id === currentUser.id ? { ...user, ...userData } : user
      );
      setUsers(updatedUsers);
      toast({
        title: "Usuário atualizado",
        description: `${userData.nome} foi atualizado com sucesso.`,
      });
    } else {
      // Add new user
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        ...userData,
      };
      setUsers([...users, newUser]);
      toast({
        title: "Usuário criado",
        description: `${userData.nome} foi criado com sucesso.`,
      });
    }
    setIsFormOpen(false);
  };

  const columns = [
    { key: "id", header: "ID" },
    { key: "nome", header: "Nome" },
    { key: "email", header: "Email" },
    { 
      key: "ativo", 
      header: "Status",
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {value ? "Ativo" : "Inativo"}
        </span>
      )
    },
    { 
      key: "grupos", 
      header: "Grupos",
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.map((grupo, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {grupo}
            </span>
          ))}
        </div>
      )
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
          Usuários
        </motion.h1>
        <Button onClick={handleAddUser}>Adicionar Usuário</Button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Table
          data={users}
          columns={columns}
          actions={{
            edit: {
              onClick: handleEditUser,
            },
            delete: {
              onClick: handleDeleteUser,
            },
          }}
          onAdd={handleAddUser}
          exportable={true}
        />
      </motion.div>

      {isFormOpen && (
        <UserForm
          user={currentUser}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário {userToDelete?.nome}? Esta ação não pode ser desfeita.
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

export default Users;

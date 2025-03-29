
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
import GroupForm from "./GroupForm";
import { getGroups, deleteGroup } from "@/services/api";

// Mock data for development
const mockGroups = [
  { id: 1, nome: "Administradores", descricao: "Acesso completo ao sistema" },
  { id: 2, nome: "Usuários", descricao: "Acesso básico ao sistema" },
  { id: 3, nome: "Financeiro", descricao: "Acesso aos módulos financeiros" },
  { id: 4, nome: "RH", descricao: "Acesso aos módulos de recursos humanos" },
  { id: 5, nome: "Vendas", descricao: "Acesso aos módulos de vendas" },
];

interface Group {
  id: number;
  nome: string;
  descricao: string;
}

const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        // In a real app, we would use this:
        // const data = await getGroups();
        // setGroups(data);
        
        // For development, use mock data
        setGroups(mockGroups);
      } catch (error) {
        console.error("Error fetching groups:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os grupos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleAddGroup = () => {
    setCurrentGroup(null);
    setIsFormOpen(true);
  };

  const handleEditGroup = (group: Group) => {
    setCurrentGroup(group);
    setIsFormOpen(true);
  };

  const handleDeleteGroup = (group: Group) => {
    setGroupToDelete(group);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!groupToDelete) return;
    
    try {
      // In a real app, we would use this:
      // await deleteGroup(groupToDelete.id);
      
      // For development, update local state
      setGroups(groups.filter(group => group.id !== groupToDelete.id));
      
      toast({
        title: "Grupo excluído",
        description: `${groupToDelete.nome} foi excluído com sucesso.`,
      });
    } catch (error) {
      console.error("Error deleting group:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o grupo",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setGroupToDelete(null);
    }
  };

  const handleFormSubmit = (groupData: any) => {
    if (currentGroup) {
      // Edit existing group
      const updatedGroups = groups.map(group => 
        group.id === currentGroup.id ? { ...group, ...groupData } : group
      );
      setGroups(updatedGroups);
      toast({
        title: "Grupo atualizado",
        description: `${groupData.nome} foi atualizado com sucesso.`,
      });
    } else {
      // Add new group
      const newGroup = {
        id: groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1,
        ...groupData,
      };
      setGroups([...groups, newGroup]);
      toast({
        title: "Grupo criado",
        description: `${groupData.nome} foi criado com sucesso.`,
      });
    }
    setIsFormOpen(false);
  };

  const columns = [
    { key: "id", header: "ID" },
    { key: "nome", header: "Nome" },
    { key: "descricao", header: "Descrição" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          Grupos
        </motion.h1>
        <Button onClick={handleAddGroup}>Adicionar Grupo</Button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Table
          data={groups}
          columns={columns}
          actions={{
            edit: {
              onClick: handleEditGroup,
            },
            delete: {
              onClick: handleDeleteGroup,
            },
          }}
          onAdd={handleAddGroup}
          exportable={true}
        />
      </motion.div>

      {isFormOpen && (
        <GroupForm
          group={currentGroup}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o grupo {groupToDelete?.nome}? Esta ação não pode ser desfeita.
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

export default Groups;

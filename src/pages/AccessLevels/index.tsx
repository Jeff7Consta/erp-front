
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
import AccessLevelForm from "./AccessLevelForm";
import { getAccessLevels, deleteAccessLevel } from "@/services/api";

// Mock data for development
const mockAccessLevels = [
  { id: 1, nome: "Leitura", descricao: "Apenas visualização" },
  { id: 2, nome: "Escrita", descricao: "Visualização e edição" },
  { id: 3, nome: "Exclusão", descricao: "Visualização, edição e exclusão" },
  { id: 4, nome: "Administração", descricao: "Acesso completo" },
];

interface AccessLevel {
  id: number;
  nome: string;
  descricao: string;
}

const AccessLevels = () => {
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentAccessLevel, setCurrentAccessLevel] = useState<AccessLevel | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accessLevelToDelete, setAccessLevelToDelete] = useState<AccessLevel | null>(null);

  useEffect(() => {
    const fetchAccessLevels = async () => {
      try {
        setLoading(true);
        // In a real app, we would use this:
        // const data = await getAccessLevels();
        // setAccessLevels(data);
        
        // For development, use mock data
        setAccessLevels(mockAccessLevels);
      } catch (error) {
        console.error("Error fetching access levels:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os níveis de acesso",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAccessLevels();
  }, []);

  const handleAddAccessLevel = () => {
    setCurrentAccessLevel(null);
    setIsFormOpen(true);
  };

  const handleEditAccessLevel = (accessLevel: AccessLevel) => {
    setCurrentAccessLevel(accessLevel);
    setIsFormOpen(true);
  };

  const handleDeleteAccessLevel = (accessLevel: AccessLevel) => {
    setAccessLevelToDelete(accessLevel);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!accessLevelToDelete) return;
    
    try {
      // In a real app, we would use this:
      // await deleteAccessLevel(accessLevelToDelete.id);
      
      // For development, update local state
      setAccessLevels(accessLevels.filter(level => level.id !== accessLevelToDelete.id));
      
      toast({
        title: "Nível de acesso excluído",
        description: `${accessLevelToDelete.nome} foi excluído com sucesso.`,
      });
    } catch (error) {
      console.error("Error deleting access level:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o nível de acesso",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setAccessLevelToDelete(null);
    }
  };

  const handleFormSubmit = (accessLevelData: any) => {
    if (currentAccessLevel) {
      // Edit existing access level
      const updatedAccessLevels = accessLevels.map(level => 
        level.id === currentAccessLevel.id ? { ...level, ...accessLevelData } : level
      );
      setAccessLevels(updatedAccessLevels);
      toast({
        title: "Nível de acesso atualizado",
        description: `${accessLevelData.nome} foi atualizado com sucesso.`,
      });
    } else {
      // Add new access level
      const newAccessLevel = {
        id: accessLevels.length > 0 ? Math.max(...accessLevels.map(level => level.id)) + 1 : 1,
        ...accessLevelData,
      };
      setAccessLevels([...accessLevels, newAccessLevel]);
      toast({
        title: "Nível de acesso criado",
        description: `${accessLevelData.nome} foi criado com sucesso.`,
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
          Níveis de Acesso
        </motion.h1>
        <Button onClick={handleAddAccessLevel}>Adicionar Nível de Acesso</Button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Table
          data={accessLevels}
          columns={columns}
          actions={{
            edit: {
              onClick: handleEditAccessLevel,
            },
            delete: {
              onClick: handleDeleteAccessLevel,
            },
          }}
          onAdd={handleAddAccessLevel}
          exportable={true}
        />
      </motion.div>

      {isFormOpen && (
        <AccessLevelForm
          accessLevel={currentAccessLevel}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o nível de acesso {accessLevelToDelete?.nome}? Esta ação não pode ser desfeita.
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

export default AccessLevels;

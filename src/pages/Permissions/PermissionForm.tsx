
import React, { useState, useEffect } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Form, { FormField } from "@/components/Form";

// Mock data for development
const mockMenus = [
  { id: 1, nome: "Dashboard" },
  { id: 3, nome: "Usuários" },
  { id: 4, nome: "Grupos" },
  { id: 5, nome: "Níveis de Acesso" },
  { id: 6, nome: "Menus" },
  { id: 7, nome: "Permissões" },
  { id: 9, nome: "Power BI" },
  { id: 10, nome: "SQL" },
];

const mockGroups = [
  { id: 1, nome: "Administradores" },
  { id: 2, nome: "Usuários" },
  { id: 3, nome: "Financeiro" },
  { id: 4, nome: "RH" },
];

const mockAccessLevels = [
  { id: 1, nome: "Leitura" },
  { id: 2, nome: "Escrita" },
  { id: 3, nome: "Exclusão" },
  { id: 4, nome: "Administração" },
];

interface PermissionFormProps {
  permission: any | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const PermissionForm: React.FC<PermissionFormProps> = ({ permission, onSubmit, onCancel }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [menuOptions, setMenuOptions] = useState<{ value: string; label: string }[]>([]);
  const [groupOptions, setGroupOptions] = useState<{ value: string; label: string }[]>([]);
  const [accessLevelOptions, setAccessLevelOptions] = useState<{ value: string; label: string }[]>([]);
  
  useEffect(() => {
    // In a real app, we would fetch these from API
    setMenuOptions(mockMenus.map(menu => ({
      value: menu.id.toString(),
      label: menu.nome,
    })));
    
    setGroupOptions(mockGroups.map(group => ({
      value: group.id.toString(),
      label: group.nome,
    })));
    
    setAccessLevelOptions(mockAccessLevels.map(level => ({
      value: level.id.toString(),
      label: level.nome,
    })));
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    onCancel();
  };

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      await onSubmit(data);
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  // Define form schema using Zod
  const permissionSchema = z.object({
    menuId: z.string().min(1, "Menu é obrigatório"),
    grupoId: z.string().min(1, "Grupo é obrigatório"),
    nivelAcessoId: z.string().min(1, "Nível de acesso é obrigatório"),
  });

  // Define form fields
  const fields: FormField<any>[] = [
    {
      name: "menuId",
      label: "Menu",
      type: "select",
      options: menuOptions,
      required: true,
    },
    {
      name: "grupoId",
      label: "Grupo",
      type: "select",
      options: groupOptions,
      required: true,
    },
    {
      name: "nivelAcessoId",
      label: "Nível de Acesso",
      type: "select",
      options: accessLevelOptions,
      required: true,
    },
  ];

  // Set default values
  const defaultValues = permission
    ? {
        menuId: permission.menuId.toString(),
        grupoId: permission.grupoId.toString(),
        nivelAcessoId: permission.nivelAcessoId.toString(),
      }
    : {};

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {permission ? "Editar Permissão" : "Adicionar Permissão"}
          </DialogTitle>
        </DialogHeader>
        <Form
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          schema={permissionSchema}
          onCancel={handleClose}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PermissionForm;

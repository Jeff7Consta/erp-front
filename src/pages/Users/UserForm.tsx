
import React, { useState, useEffect } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Form, { FormField } from "@/components/Form";

// Mock data for groups
const mockGroups = [
  { id: 1, nome: "Administradores" },
  { id: 2, nome: "Usuários" },
  { id: 3, nome: "Financeiro" },
  { id: 4, nome: "RH" },
];

interface UserFormProps {
  user: any | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [groupOptions, setGroupOptions] = useState<{ value: string; label: string }[]>([]);
  
  useEffect(() => {
    // In a real app, we would fetch groups from API
    // For now, using mock data
    const options = mockGroups.map(group => ({
      value: group.id.toString(),
      label: group.nome,
    }));
    setGroupOptions(options);
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
  const userSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    senha: user ? z.string().optional() : z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    ativo: z.boolean().default(true),
    grupo_id: z.string().min(1, "Selecione pelo menos um grupo"),
  });

  // Define form fields
  const fields: FormField<any>[] = [
    {
      name: "nome",
      label: "Nome",
      type: "text",
      placeholder: "Nome completo",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "usuario@empresa.com",
      required: true,
    },
    {
      name: "senha",
      label: user ? "Senha (deixe em branco para manter)" : "Senha",
      type: "password",
      placeholder: "••••••",
      required: !user,
    },
    {
      name: "grupo_id",
      label: "Grupo",
      type: "select",
      options: groupOptions,
      required: true,
    },
    {
      name: "ativo",
      label: "Ativo",
      type: "switch",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {user ? `Editar Usuário: ${user.nome}` : "Adicionar Usuário"}
          </DialogTitle>
        </DialogHeader>
        <Form
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={user || { ativo: true }}
          schema={userSchema}
          onCancel={handleClose}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;

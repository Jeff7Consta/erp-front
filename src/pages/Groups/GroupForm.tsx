
import React, { useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Form, { FormField } from "@/components/Form";

interface GroupFormProps {
  group: any | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const GroupForm: React.FC<GroupFormProps> = ({ group, onSubmit, onCancel }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);

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
  const groupSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    descricao: z.string().optional(),
  });

  // Define form fields
  const fields: FormField<any>[] = [
    {
      name: "nome",
      label: "Nome",
      type: "text",
      placeholder: "Nome do grupo",
      required: true,
    },
    {
      name: "descricao",
      label: "Descrição",
      type: "textarea",
      placeholder: "Descrição do grupo",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {group ? `Editar Grupo: ${group.nome}` : "Adicionar Grupo"}
          </DialogTitle>
        </DialogHeader>
        <Form
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={group || {}}
          schema={groupSchema}
          onCancel={handleClose}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default GroupForm;


import React, { useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Form, { FormField } from "@/components/Form";

// Icon options
const iconOptions = [
  { value: "home", label: "Home" },
  { value: "settings", label: "Settings" },
  { value: "user", label: "User" },
  { value: "users", label: "Users" },
  { value: "shield", label: "Shield" },
  { value: "menu", label: "Menu" },
  { value: "lock", label: "Lock" },
  { value: "bar-chart", label: "Bar Chart" },
  { value: "pie-chart", label: "Pie Chart" },
  { value: "database", label: "Database" },
  { value: "file-text", label: "File Text" },
  { value: "list", label: "List" },
  { value: "folder", label: "Folder" },
  { value: "calendar", label: "Calendar" },
  { value: "mail", label: "Mail" },
];

interface MenuFormProps {
  menu: any | null;
  parentMenus: any[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const MenuForm: React.FC<MenuFormProps> = ({ menu, parentMenus, onSubmit, onCancel }) => {
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

  // Create parent menu options
  const parentMenuOptions = [
    { value: "", label: "Nenhum" },
    ...parentMenus
      .filter(m => !menu || m.id !== menu.id) // Exclude current menu from parent options
      .map(m => ({ value: m.id.toString(), label: m.nome }))
  ];

  // Define form schema using Zod
  const menuSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    rota: z.string().optional(),
    icone: z.string().min(1, "Ícone é obrigatório"),
    paiId: z.string().optional(),
    ordem: z.string().min(1, "Ordem é obrigatória"),
  });

  // Define form fields
  const fields: FormField<any>[] = [
    {
      name: "nome",
      label: "Nome",
      type: "text",
      placeholder: "Nome do menu",
      required: true,
    },
    {
      name: "rota",
      label: "Rota",
      type: "text",
      placeholder: "Exemplo: /dashboard (deixe em branco para menus com submenu)",
    },
    {
      name: "icone",
      label: "Ícone",
      type: "select",
      options: iconOptions,
      required: true,
    },
    {
      name: "paiId",
      label: "Menu Pai",
      type: "select",
      options: parentMenuOptions,
    },
    {
      name: "ordem",
      label: "Ordem",
      type: "number",
      placeholder: "Ordem de exibição",
      required: true,
    },
  ];

  // Set default values
  const defaultValues = menu
    ? {
        ...menu,
        paiId: menu.paiId ? menu.paiId.toString() : "",
        ordem: menu.ordem.toString(),
      }
    : { ordem: "1", icone: "home", paiId: "" };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {menu ? `Editar Menu: ${menu.nome}` : "Adicionar Menu"}
          </DialogTitle>
        </DialogHeader>
        <Form
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          schema={menuSchema}
          onCancel={handleClose}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MenuForm;

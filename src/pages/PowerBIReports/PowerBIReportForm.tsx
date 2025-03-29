
import React, { useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Form, { FormField } from "@/components/Form";

interface PowerBIReportFormProps {
  report: any | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const PowerBIReportForm: React.FC<PowerBIReportFormProps> = ({ report, onSubmit, onCancel }) => {
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
  const reportSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    url: z.string().url("URL inválida").min(1, "URL é obrigatória"),
    descricao: z.string().optional(),
    ordem: z.string().min(1, "Ordem é obrigatória"),
  });

  // Define form fields
  const fields: FormField<any>[] = [
    {
      name: "nome",
      label: "Nome",
      type: "text",
      placeholder: "Nome do relatório",
      required: true,
    },
    {
      name: "url",
      label: "URL",
      type: "text",
      placeholder: "https://app.powerbi.com/reportEmbed?reportId=123",
      required: true,
    },
    {
      name: "descricao",
      label: "Descrição",
      type: "textarea",
      placeholder: "Descrição do relatório",
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
  const defaultValues = report
    ? {
        ...report,
        ordem: report.ordem.toString(),
      }
    : { ordem: "1" };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {report ? `Editar Relatório: ${report.nome}` : "Adicionar Relatório"}
          </DialogTitle>
        </DialogHeader>
        <Form
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          schema={reportSchema}
          onCancel={handleClose}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PowerBIReportForm;

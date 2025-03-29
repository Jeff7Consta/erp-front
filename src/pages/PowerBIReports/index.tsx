
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
import PowerBIReportForm from "./PowerBIReportForm";
import { getPowerBIReports, deletePowerBIReport } from "@/services/api";
import { useNavigate } from "react-router-dom";

// Mock data for development
const mockReports = [
  { id: 1, nome: "Dashboard de Vendas", url: "https://app.powerbi.com/reportEmbed?reportId=123", descricao: "Análise de vendas por região", ordem: 1 },
  { id: 2, nome: "Performance Financeira", url: "https://app.powerbi.com/reportEmbed?reportId=456", descricao: "Indicadores financeiros", ordem: 2 },
  { id: 3, nome: "Análise de Clientes", url: "https://app.powerbi.com/reportEmbed?reportId=789", descricao: "Segmentação de clientes", ordem: 3 },
  { id: 4, nome: "Estoque e Logística", url: "https://app.powerbi.com/reportEmbed?reportId=101", descricao: "Controle de estoque", ordem: 4 },
];

interface PowerBIReport {
  id: number;
  nome: string;
  url: string;
  descricao: string;
  ordem: number;
}

const PowerBIReports = () => {
  const [reports, setReports] = useState<PowerBIReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState<PowerBIReport | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<PowerBIReport | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        // In a real app, we would use this:
        // const data = await getPowerBIReports();
        // setReports(data);
        
        // For development, use mock data
        setReports(mockReports);
      } catch (error) {
        console.error("Error fetching Power BI reports:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os relatórios Power BI",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleAddReport = () => {
    setCurrentReport(null);
    setIsFormOpen(true);
  };

  const handleEditReport = (report: PowerBIReport) => {
    setCurrentReport(report);
    setIsFormOpen(true);
  };

  const handleViewReport = (report: PowerBIReport) => {
    navigate(`/relatorios-powerbi/view/${report.id}`);
  };

  const handleDeleteReport = (report: PowerBIReport) => {
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!reportToDelete) return;
    
    try {
      // In a real app, we would use this:
      // await deletePowerBIReport(reportToDelete.id);
      
      // For development, update local state
      setReports(reports.filter(report => report.id !== reportToDelete.id));
      
      toast({
        title: "Relatório excluído",
        description: `${reportToDelete.nome} foi excluído com sucesso.`,
      });
    } catch (error) {
      console.error("Error deleting report:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o relatório",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setReportToDelete(null);
    }
  };

  const handleFormSubmit = (reportData: any) => {
    if (currentReport) {
      // Edit existing report
      const updatedReports = reports.map(report => 
        report.id === currentReport.id ? { ...report, ...reportData, ordem: Number(reportData.ordem) } : report
      );
      setReports(updatedReports);
      toast({
        title: "Relatório atualizado",
        description: `${reportData.nome} foi atualizado com sucesso.`,
      });
    } else {
      // Add new report
      const newReport = {
        id: reports.length > 0 ? Math.max(...reports.map(r => r.id)) + 1 : 1,
        ...reportData,
        ordem: Number(reportData.ordem),
      };
      setReports([...reports, newReport]);
      toast({
        title: "Relatório criado",
        description: `${reportData.nome} foi criado com sucesso.`,
      });
    }
    setIsFormOpen(false);
  };

  const columns = [
    { key: "id", header: "ID" },
    { key: "nome", header: "Nome" },
    { key: "descricao", header: "Descrição" },
    { 
      key: "url", 
      header: "URL",
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
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
          Relatórios Power BI
        </motion.h1>
        <Button onClick={handleAddReport}>Adicionar Relatório</Button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Table
          data={reports}
          columns={columns}
          actions={{
            view: {
              onClick: handleViewReport,
            },
            edit: {
              onClick: handleEditReport,
            },
            delete: {
              onClick: handleDeleteReport,
            },
          }}
          onAdd={handleAddReport}
          exportable={true}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Visualizar Relatórios</h3>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports.map((report) => (
                <motion.div
                  key={report.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-primary/5 p-4 rounded-lg cursor-pointer"
                  onClick={() => handleViewReport(report)}
                >
                  <h4 className="font-medium">{report.nome}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {report.descricao}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {isFormOpen && (
        <PowerBIReportForm
          report={currentReport}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o relatório {reportToDelete?.nome}? Esta ação não pode ser desfeita.
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

export default PowerBIReports;

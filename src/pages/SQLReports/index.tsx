
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
import SQLReportForm from "./SQLReportForm";
import { getSQLReports, deleteSQLReport } from "@/services/api";
import { useNavigate } from "react-router-dom";

// Mock data for development
const mockReports = [
  { id: 1, nome: "Vendas por Estado", descricao: "Relatório de vendas agrupadas por estado", sql: "SELECT estado, SUM(total) as total FROM vendas GROUP BY estado ORDER BY total DESC", ordem: 1 },
  { id: 2, nome: "Produtos mais vendidos", descricao: "Top 10 produtos mais vendidos", sql: "SELECT produto_nome, SUM(quantidade) as total FROM vendas_itens GROUP BY produto_nome ORDER BY total DESC LIMIT 10", ordem: 2 },
  { id: 3, nome: "Clientes por região", descricao: "Distribuição de clientes por região", sql: "SELECT regiao, COUNT(*) as total FROM clientes GROUP BY regiao ORDER BY total DESC", ordem: 3 },
  { id: 4, nome: "Vendas por período", descricao: "Vendas consolidadas por período", sql: "SELECT DATE_TRUNC('month', data_venda) as periodo, SUM(total) as total FROM vendas GROUP BY periodo ORDER BY periodo", ordem: 4 },
];

interface SQLReport {
  id: number;
  nome: string;
  descricao: string;
  sql: string;
  ordem: number;
}

const SQLReports = () => {
  const [reports, setReports] = useState<SQLReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState<SQLReport | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<SQLReport | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        // In a real app, we would use this:
        // const data = await getSQLReports();
        // setReports(data);
        
        // For development, use mock data
        setReports(mockReports);
      } catch (error) {
        console.error("Error fetching SQL reports:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os relatórios SQL",
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

  const handleEditReport = (report: SQLReport) => {
    setCurrentReport(report);
    setIsFormOpen(true);
  };

  const handleViewReport = (report: SQLReport) => {
    navigate(`/relatorios-sql/view/${report.id}`);
  };

  const handleDeleteReport = (report: SQLReport) => {
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!reportToDelete) return;
    
    try {
      // In a real app, we would use this:
      // await deleteSQLReport(reportToDelete.id);
      
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
      key: "sql", 
      header: "SQL",
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
          Relatórios SQL
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
        <SQLReportForm
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

export default SQLReports;

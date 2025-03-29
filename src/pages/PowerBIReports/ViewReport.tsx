
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPowerBIReportById } from "@/services/api";
import { toast } from "@/hooks/use-toast";

// Mock data for development
const mockReports = [
  { id: 1, nome: "Dashboard de Vendas", url: "https://app.powerbi.com/reportEmbed?reportId=123", descricao: "Análise de vendas por região", ordem: 1 },
  { id: 2, nome: "Performance Financeira", url: "https://app.powerbi.com/reportEmbed?reportId=456", descricao: "Indicadores financeiros", ordem: 2 },
  { id: 3, nome: "Análise de Clientes", url: "https://app.powerbi.com/reportEmbed?reportId=789", descricao: "Segmentação de clientes", ordem: 3 },
  { id: 4, nome: "Estoque e Logística", url: "https://app.powerbi.com/reportEmbed?reportId=101", descricao: "Controle de estoque", ordem: 4 },
];

const ViewReport = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        // In a real app, we would use this:
        // const data = await getPowerBIReportById(Number(id));
        
        // For development, use mock data
        const reportData = mockReports.find(r => r.id === Number(id));
        
        if (reportData) {
          setReport(reportData);
        } else {
          toast({
            title: "Erro",
            description: "Relatório não encontrado",
            variant: "destructive",
          });
          navigate("/relatorios-powerbi");
        }
      } catch (error) {
        console.error("Error fetching report:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o relatório",
          variant: "destructive",
        });
        navigate("/relatorios-powerbi");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id, navigate]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/relatorios-powerbi")}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold"
          >
            {report?.nome || "Relatório"}
          </motion.h1>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="aspect-video w-full bg-white border border-border rounded-lg overflow-hidden shadow-sm"
        >
          {report && (
            <iframe
              src={report.url}
              title={report.nome}
              className="w-full h-full"
              allowFullScreen
            />
          )}
        </motion.div>
      )}

      {report && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="card-title">Informações do Relatório</h3>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nome</p>
                <p>{report.nome}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Descrição</p>
                <p>{report.descricao}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">URL</p>
                <p className="truncate">{report.url}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ordem</p>
                <p>{report.ordem}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ViewReport;

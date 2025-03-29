
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSQLReportById, executeSQLReport } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import Table from "@/components/Table";

// Mock data for development
const mockReports = [
  { id: 1, nome: "Vendas por Estado", descricao: "Relatório de vendas agrupadas por estado", sql: "SELECT estado, SUM(total) as total FROM vendas GROUP BY estado ORDER BY total DESC", ordem: 1 },
  { id: 2, nome: "Produtos mais vendidos", descricao: "Top 10 produtos mais vendidos", sql: "SELECT produto_nome, SUM(quantidade) as total FROM vendas_itens GROUP BY produto_nome ORDER BY total DESC LIMIT 10", ordem: 2 },
  { id: 3, nome: "Clientes por região", descricao: "Distribuição de clientes por região", sql: "SELECT regiao, COUNT(*) as total FROM clientes GROUP BY regiao ORDER BY total DESC", ordem: 3 },
  { id: 4, nome: "Vendas por período", descricao: "Vendas consolidadas por período", sql: "SELECT DATE_TRUNC('month', data_venda) as periodo, SUM(total) as total FROM vendas GROUP BY periodo ORDER BY periodo", ordem: 4 },
];

// Mock execution results
const mockResults = {
  1: {
    colunas: ["estado", "total"],
    dados: [
      { estado: "SP", total: 45000 },
      { estado: "RJ", total: 32000 },
      { estado: "MG", total: 28000 },
      { estado: "RS", total: 19000 },
      { estado: "PR", total: 18700 },
      { estado: "BA", total: 17500 },
      { estado: "SC", total: 15800 },
      { estado: "GO", total: 12500 },
      { estado: "PE", total: 11800 },
      { estado: "CE", total: 10500 },
    ]
  },
  2: {
    colunas: ["produto_nome", "total"],
    dados: [
      { produto_nome: "Notebook Ultra Slim", total: 1250 },
      { produto_nome: "Smartphone X Pro", total: 982 },
      { produto_nome: "Monitor 27' 4K", total: 758 },
      { produto_nome: "Teclado Mecânico RGB", total: 645 },
      { produto_nome: "Fone de Ouvido Bluetooth", total: 620 },
      { produto_nome: "Mouse sem Fio", total: 598 },
      { produto_nome: "Webcam HD", total: 456 },
      { produto_nome: "SSD 1TB", total: 432 },
      { produto_nome: "Roteador Mesh", total: 410 },
      { produto_nome: "Powerbank 20000mAh", total: 389 },
    ]
  },
  3: {
    colunas: ["regiao", "total"],
    dados: [
      { regiao: "Sudeste", total: 12500 },
      { regiao: "Nordeste", total: 8700 },
      { regiao: "Sul", total: 7800 },
      { regiao: "Centro-Oeste", total: 4200 },
      { regiao: "Norte", total: 3100 },
    ]
  },
  4: {
    colunas: ["periodo", "total"],
    dados: [
      { periodo: "2023-01-01", total: 125000 },
      { periodo: "2023-02-01", total: 138000 },
      { periodo: "2023-03-01", total: 142500 },
      { periodo: "2023-04-01", total: 156800 },
      { periodo: "2023-05-01", total: 162300 },
      { periodo: "2023-06-01", total: 178500 },
      { periodo: "2023-07-01", total: 186200 },
      { periodo: "2023-08-01", total: 192000 },
      { periodo: "2023-09-01", total: 198700 },
      { periodo: "2023-10-01", total: 205500 },
      { periodo: "2023-11-01", total: 234000 },
      { periodo: "2023-12-01", total: 267800 },
    ]
  }
};

const ViewReport = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        // In a real app, we would use this:
        // const data = await getSQLReportById(Number(id));
        
        // For development, use mock data
        const reportData = mockReports.find(r => r.id === Number(id));
        
        if (reportData) {
          setReport(reportData);
          executeReport(Number(id));
        } else {
          toast({
            title: "Erro",
            description: "Relatório não encontrado",
            variant: "destructive",
          });
          navigate("/relatorios-sql");
        }
      } catch (error) {
        console.error("Error fetching report:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o relatório",
          variant: "destructive",
        });
        navigate("/relatorios-sql");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id, navigate]);

  const executeReport = async (reportId: number) => {
    try {
      setExecuting(true);
      // In a real app, we would use this:
      // const data = await executeSQLReport(reportId);
      
      // For development, use mock results
      const results = mockResults[reportId as keyof typeof mockResults];
      
      if (results) {
        setReportData(results);
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível executar o relatório",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error executing report:", error);
      toast({
        title: "Erro",
        description: "Não foi possível executar o relatório",
        variant: "destructive",
      });
    } finally {
      setExecuting(false);
    }
  };

  const exportToCSV = () => {
    if (!reportData || !reportData.dados || reportData.dados.length === 0) {
      toast({
        title: "Erro",
        description: "Não há dados para exportar",
        variant: "destructive",
      });
      return;
    }
    
    // Generate CSV content
    const headers = reportData.colunas.join(",");
    const rows = reportData.dados.map((row: any) => 
      reportData.colunas.map((col: string) => {
        const value = row[col];
        return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(",")
    ).join("\n");
    
    const csvContent = `${headers}\n${rows}`;
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${report.nome}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportação concluída",
      description: "Os dados foram exportados com sucesso.",
    });
  };

  // Prepare data for the table component
  const getTableData = () => {
    if (!reportData || !reportData.dados) return { data: [], columns: [] };
    
    const columns = reportData.colunas.map((col: string) => ({
      key: col,
      header: col,
    }));
    
    return {
      data: reportData.dados,
      columns,
    };
  };

  const { data, columns } = getTableData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/relatorios-sql")}
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
        
        <Button
          onClick={exportToCSV}
          disabled={!reportData || !reportData.dados || reportData.dados.length === 0}
          className="flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {loading || executing ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {report && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="card-header">
                <h3 className="card-title">Detalhes do Relatório</h3>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                    <p>{report.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Descrição</p>
                    <p>{report.descricao}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-muted-foreground">SQL</p>
                  <pre className="p-3 bg-muted rounded-md text-sm overflow-x-auto">
                    {report.sql}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}

          {reportData && reportData.dados && reportData.dados.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Table
                data={data}
                columns={columns}
                exportable={false}
                pagination={{
                  itemsPerPage: 10,
                  totalItems: data.length,
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center items-center h-64 bg-muted rounded-lg"
            >
              <p className="text-muted-foreground">Nenhum dado encontrado</p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default ViewReport;

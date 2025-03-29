
import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, BarChart2, ShieldCheck, Menu, Lock } from "lucide-react";

const Dashboard = () => {
  const { usuario: user } = useAuth(); // 👈 usa alias pra manter o restante do código igual


  const cardItems = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Usuários",
      count: "24",
      link: "/usuarios",
      description: "Gerenciar contas de usuários",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Grupos",
      count: "7",
      link: "/grupos",
      description: "Gerenciar grupos de usuários",
    },
    {
      icon: <Lock className="h-8 w-8 text-primary" />,
      title: "Níveis de Acesso",
      count: "12",
      link: "/niveis-acesso",
      description: "Configurar níveis de acesso",
    },
    {
      icon: <Menu className="h-8 w-8 text-primary" />,
      title: "Menus",
      count: "18",
      link: "/menus",
      description: "Personalizar menus do sistema",
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-primary" />,
      title: "Relatórios Power BI",
      count: "5",
      link: "/relatorios-powerbi",
      description: "Visualizar dashboards",
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Relatórios SQL",
      count: "9",
      link: "/relatorios-sql",
      description: "Consultas e relatórios analíticos",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold"
        >
          Dashboard
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground"
        >
          Bem-vindo, {user?.nome}
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {cardItems.map((item, index) => (
          <motion.a
            key={index}
            href={item.link}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="card transform transition-all duration-200"
          >
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                {item.icon}
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{item.count}</p>
                <CardDescription className="text-sm text-muted-foreground mt-2">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.a>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Atividade recente</CardTitle>
            <CardDescription>
              Suas últimas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">
                        {["Login no sistema", "Visualizou relatório", "Editou permissões", "Criou usuário", "Atualizou menu"][i % 5]}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {i > 0 ? `${i} ${i === 1 ? 'hora' : 'horas'} atrás` : "Agora"}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import { MenuProvider } from "@/contexts/MenuContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Groups from "./pages/Groups";
import AccessLevels from "./pages/AccessLevels";
import Menus from "./pages/Menus";
import Permissions from "./pages/Permissions";
import PowerBIReports from "./pages/PowerBIReports";
import PowerBIReportView from "./pages/PowerBIReports/ViewReport";
import SQLReports from "./pages/SQLReports";
import SQLReportView from "./pages/SQLReports/ViewReport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <MenuProvider>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/" 
                  element={<Navigate to="/dashboard" replace />} 
                />
                <Route 
                  path="/dashboard" 
                  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
                />
                
                {/* User Management */}
                <Route 
                  path="/usuarios" 
                  element={<ProtectedRoute><Users /></ProtectedRoute>} 
                />
                <Route 
                  path="/grupos" 
                  element={<ProtectedRoute><Groups /></ProtectedRoute>} 
                />
                <Route 
                  path="/niveis-acesso" 
                  element={<ProtectedRoute><AccessLevels /></ProtectedRoute>} 
                />
                <Route 
                  path="/menus" 
                  element={<ProtectedRoute><Menus /></ProtectedRoute>} 
                />
                <Route 
                  path="/permissoes" 
                  element={<ProtectedRoute><Permissions /></ProtectedRoute>} 
                />
                
                {/* Reports */}
                <Route 
                  path="/relatorios-powerbi" 
                  element={<ProtectedRoute><PowerBIReports /></ProtectedRoute>} 
                />
                <Route 
                  path="/relatorios-powerbi/view/:id" 
                  element={<ProtectedRoute><PowerBIReportView /></ProtectedRoute>} 
                />
                <Route 
                  path="/relatorios-sql" 
                  element={<ProtectedRoute><SQLReports /></ProtectedRoute>} 
                />
                <Route 
                  path="/relatorios-sql/view/:id" 
                  element={<ProtectedRoute><SQLReportView /></ProtectedRoute>} 
                />
                
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </MenuProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

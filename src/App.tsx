
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import MetricsDashboard from "./pages/MetricsDashboard";
import ChatsDashboard from "./pages/ChatsDashboard";
import KnowledgeManager from "./pages/KnowledgeManager";
import ClientsDashboard from "./pages/ClientsDashboard";
import Evolution from "./pages/Evolution";
import Schedule from "./pages/Schedule";
import NotFound from "./pages/NotFound";
import ConfigurationManager from "./pages/ConfigurationManager";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Function to migrate old domain URLs in localStorage
const migrateLocalStorageUrls = () => {
  const savedEndpoints = localStorage.getItem('webhookEndpoints');
  if (savedEndpoints) {
    try {
      const endpoints = JSON.parse(savedEndpoints);
      let updated = false;
      
      // Update URLs from old domain to new domain
      Object.keys(endpoints).forEach(key => {
        if (endpoints[key] && typeof endpoints[key] === 'string') {
          if (endpoints[key].includes('n8nlabz.com.br')) {
            endpoints[key] = endpoints[key].replace('n8nlabz.com.br', 'comunidadeimobiliaria.com.br');
            updated = true;
          }
          // Also fix webhook subdomain to endpoint subdomain
          if (endpoints[key].includes('webhook.comunidadeimobiliaria.com.br')) {
            endpoints[key] = endpoints[key].replace('webhook.comunidadeimobiliaria.com.br', 'endpoint.comunidadeimobiliaria.com.br');
            updated = true;
          }
        }
      });
      
      if (updated) {
        localStorage.setItem('webhookEndpoints', JSON.stringify(endpoints));
        console.log('Updated localStorage URLs to use correct endpoint subdomain');
      }
    } catch (error) {
      console.error('Error migrating localStorage URLs:', error);
    }
  }
};

const App = () => {
  useEffect(() => {
    migrateLocalStorageUrls();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/metrics" element={<MetricsDashboard />} />
                <Route path="/chats" element={<ChatsDashboard />} />
                <Route path="/knowledge" element={<KnowledgeManager />} />
                <Route path="/clients" element={<ClientsDashboard />} />
                <Route path="/evolution" element={<Evolution />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/configuration" element={<ConfigurationManager />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

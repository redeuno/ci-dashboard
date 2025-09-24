import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-black dark:bg-gray-800 text-white shadow-md transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <img 
              src="/lovable-uploads/bc852a02-f2b9-4981-a30c-7c19e7e2829c.png" 
              alt="Comunidade Imobiliária Logo" 
              className="h-10 w-auto object-contain" 
            />
            <h1 className="text-2xl font-bold">Comunidade Imobiliária</h1>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <Badge variant="outline" className="bg-white/10 text-white border-0 px-3 py-1">
                {user?.user_metadata?.name || user?.email}
              </Badge>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">404</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">Oops! Página não encontrada</p>
          <Button onClick={() => navigate('/dashboard')} className="bg-ci-accent hover:bg-ci-accent/80 text-ci-primary">
            Voltar ao Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
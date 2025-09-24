
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
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
          <Badge variant="outline" className="bg-white/10 text-white border-0 px-3 py-1">
            {user?.user_metadata?.name || user?.email}
          </Badge>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

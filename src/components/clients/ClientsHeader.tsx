
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ClientsHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-black dark:bg-gray-800 text-white shadow-md transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/bc852a02-f2b9-4981-a30c-7c19e7e2829c.png" 
            alt="Comunidade Imobiliária Logo" 
            className="h-10 w-auto object-contain" 
          />
          <h1 className="text-2xl font-bold">CRM Comunidade Imobiliária</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="default" onClick={() => navigate('/dashboard')} style={{backgroundColor: 'hsl(80, 100%, 50%)', color: 'black'}}>
            Voltar para Dashboard
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ClientsHeader;

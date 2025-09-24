
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings2 } from 'lucide-react';

const ConfigCard = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/configuration');
  };
  
  return (
    <Card 
      className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
      onClick={handleClick}
    >
      <CardHeader className="pb-2 bg-gradient-to-r from-black to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-6 w-6" />
          Configurações
        </CardTitle>
        <CardDescription className="text-gray-200">
          Gerenciamento de endpoints
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4 flex justify-center">
          <div className="bg-gray-100 dark:bg-gray-900/30 p-6 rounded-full">
            <Settings2 className="h-14 w-14 animate-spin-slow" style={{color: 'hsl(80, 100%, 50%)'}} />
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          Configure os endpoints do sistema e integrações.
        </p>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-700/50 rounded-b-lg border-t dark:border-gray-700 flex justify-center py-3">
        <Badge variant="outline" className="text-black dark:text-gray-300" style={{backgroundColor: 'hsl(80, 100%, 50%)'}}>
          Gerenciar configurações
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default ConfigCard;

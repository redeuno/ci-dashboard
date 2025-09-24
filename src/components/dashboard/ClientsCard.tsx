
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

const ClientsCard = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/clients');
  };
  
  return (
    <Card className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white" onClick={handleClick}>
      <CardHeader className="pb-2 bg-gradient-to-r from-black to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          Clientes
        </CardTitle>
        <CardDescription className="text-gray-200">
          CRM e gerenciamento
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4 flex justify-center">
          <div className="bg-gray-100 dark:bg-gray-900/30 p-6 rounded-full">
            <Users className="h-14 w-14 animate-bounce" style={{color: 'hsl(80, 100%, 50%)'}} />
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          Gerencie seus clientes, histórico e relacionamentos.
        </p>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-700/50 rounded-b-lg border-t dark:border-gray-700 flex justify-center py-3">
        <Badge variant="outline" className="text-black dark:text-gray-300" style={{backgroundColor: 'hsl(80, 100%, 50%)'}}>
          Acessar CRM de clientes
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default ClientsCard;

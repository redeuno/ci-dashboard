
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link, MessageSquare, Settings } from 'lucide-react';

const EvolutionCard = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/evolution');
  };
  
  return (
    <Card className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white" onClick={handleClick}>
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-400 to-cyan-500 dark:from-blue-500 dark:to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Link className="h-6 w-6" />
          Evolution
        </CardTitle>
        <CardDescription className="text-blue-100">
          Conectar e sincronizar
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4 flex justify-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full">
            <Link className="h-14 w-14 text-blue-500 dark:text-blue-400" />
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
          Gerencie instâncias WhatsApp e sincronize com a plataforma Evolution.
        </p>
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => { e.stopPropagation(); navigate('/evolution'); }}
            className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400"
          >
            <Settings className="h-4 w-4 mr-2" />
            Instâncias
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => { e.stopPropagation(); navigate('/chats'); }}
            className="text-green-600 border-green-600 hover:bg-green-50 dark:text-green-400 dark:border-green-400"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chats
          </Button>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-700/50 rounded-b-lg border-t dark:border-gray-700 flex justify-center py-3">
        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50">
          Conectar Evolution
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default EvolutionCard;

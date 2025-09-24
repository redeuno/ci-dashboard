
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart } from 'lucide-react';

const MetricsCard = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/metrics');
  };
  
  return (
    <Card className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white" onClick={handleClick}>
      <CardHeader className="pb-2 bg-gradient-to-r from-black to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-6 w-6" />
          Métricas
        </CardTitle>
        <CardDescription className="text-gray-200">
          Estatísticas e indicadores
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4 flex justify-center">
          <div className="bg-gray-100 dark:bg-gray-900/30 p-6 rounded-full relative">
            <LineChart className="h-14 w-14" style={{color: 'hsl(80, 100%, 50%)'}} />
            <div className="absolute -top-2 -right-2 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse" style={{backgroundColor: 'hsl(80, 100%, 50%)'}}>
              110
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-center">
            <LineChart className="h-5 w-5 mr-1" style={{color: 'hsl(80, 100%, 50%)'}} />
            <span className="text-sm text-gray-600 dark:text-gray-300">Análise de indicadores disponível</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-700/50 rounded-b-lg border-t dark:border-gray-700 flex justify-center py-3">
        <Badge variant="outline" className="text-black dark:text-gray-300" style={{backgroundColor: 'hsl(80, 100%, 50%)'}}>
          Acessar dashboard de métricas
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default MetricsCard;

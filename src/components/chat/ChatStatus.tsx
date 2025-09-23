import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

interface ChatStatusProps {
  instanceName?: string;
  isConnected?: boolean;
  isLoading?: boolean;
}

const ChatStatus = ({ instanceName, isConnected = false, isLoading = false }: ChatStatusProps) => {
  if (isLoading) {
    return (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800">
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        Verificando...
      </Badge>
    );
  }

  if (isConnected) {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
        <Wifi className="h-3 w-3 mr-1" />
        {instanceName ? `${instanceName} - Conectado` : 'Conectado'}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
      <WifiOff className="h-3 w-3 mr-1" />
      {instanceName ? `${instanceName} - Desconectado` : 'Desconectado'}
    </Badge>
  );
};

export default ChatStatus;
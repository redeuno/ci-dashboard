import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, MessageSquare, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { EvolutionInstance } from '@/hooks/useEvolutionInstances';
import { useNavigate } from 'react-router-dom';

interface InstancesListProps {
  instances: EvolutionInstance[];
  loading: boolean;
  onDelete: (instanceId: number) => void;
  onReconnect: (instance: EvolutionInstance) => void;
}

const InstancesList = ({ instances, loading, onDelete, onReconnect }: InstancesListProps) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: string, connectionConfirmed: boolean) => {
    if (status === 'connected' && connectionConfirmed) {
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
          <Wifi className="h-3 w-3 mr-1" />
          Conectado
        </Badge>
      );
    } else if (status === 'connecting') {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          Conectando
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
          <WifiOff className="h-3 w-3 mr-1" />
          Desconectado
        </Badge>
      );
    }
  };

  const handleViewChats = (instanceName: string) => {
    // Navigate to chats and filter by instance
    navigate('/chats', { state: { filterInstance: instanceName } });
  };

  if (loading) {
    return (
      <Card className="dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Carregando instâncias...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (instances.length === 0) {
    return (
      <Card className="dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Nenhuma instância encontrada. Crie uma nova instância para começar.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {instances.map((instance) => (
        <Card key={instance.id} className="dark:bg-gray-800">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  {instance.name}
                  {getStatusBadge(instance.status, instance.connection_confirmed)}
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Webhook: {instance.webhook_path}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Criado em: {new Date(instance.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="flex space-x-2">
                {instance.status === 'connected' && instance.connection_confirmed && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewChats(instance.name)}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Ver Chats
                  </Button>
                )}
                {(instance.status === 'disconnected' || !instance.connection_confirmed) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReconnect(instance)}
                    className="text-green-600 border-green-600 hover:bg-green-50 dark:text-green-400 dark:border-green-400"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reconectar
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(instance.id)}
                  className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default InstancesList;
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EvolutionInstance {
  id: number;
  name: string;
  webhook_path: string;
  status: string; // Changed to generic string to match database
  created_at: string;
  updated_at: string;
  qr_code_data?: string;
  connection_confirmed: boolean;
}

export function useEvolutionInstances() {
  const [instances, setInstances] = useState<EvolutionInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInstances = async () => {
    try {
      console.log('Fetching Evolution instances...');
      const { data, error } = await supabase
        .from('evolution_instances')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching instances:', error);
        throw error;
      }

      console.log('Fetched instances:', data);
      setInstances(data || []);
    } catch (error) {
      console.error('Failed to fetch Evolution instances:', error);
      toast({
        title: "Erro ao carregar instâncias",
        description: "Não foi possível carregar as instâncias Evolution.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createInstance = async (name: string, webhookPath: string) => {
    try {
      console.log('Creating instance:', { name, webhookPath });
      const { data, error } = await supabase
        .from('evolution_instances')
        .insert([{
          name: name.trim(),
          webhook_path: webhookPath.trim(),
          status: 'connecting',
          connection_confirmed: false
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating instance:', error);
        throw error;
      }

      console.log('Instance created:', data);
      await fetchInstances(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Failed to create instance:', error);
      toast({
        title: "Erro ao criar instância",
        description: "Não foi possível criar a instância.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateInstanceStatus = async (instanceId: number, status: string, connectionConfirmed?: boolean) => {
    try {
      console.log('Updating instance status:', { instanceId, status, connectionConfirmed });
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (connectionConfirmed !== undefined) {
        updateData.connection_confirmed = connectionConfirmed;
      }

      const { error } = await supabase
        .from('evolution_instances')
        .update(updateData)
        .eq('id', instanceId);

      if (error) {
        console.error('Error updating instance status:', error);
        throw error;
      }

      await fetchInstances(); // Refresh the list
    } catch (error) {
      console.error('Failed to update instance status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da instância.",
        variant: "destructive"
      });
    }
  };

  const deleteInstance = async (instanceId: number) => {
    try {
      console.log('Deleting instance:', instanceId);
      const { error } = await supabase
        .from('evolution_instances')
        .delete()
        .eq('id', instanceId);

      if (error) {
        console.error('Error deleting instance:', error);
        throw error;
      }

      await fetchInstances(); // Refresh the list
      toast({
        title: "Instância removida",
        description: "A instância foi removida com sucesso.",
      });
    } catch (error) {
      console.error('Failed to delete instance:', error);
      toast({
        title: "Erro ao remover instância",
        description: "Não foi possível remover a instância.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchInstances();

    // Setup realtime subscription
    const subscription = supabase
      .channel('evolution_instances_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'evolution_instances' 
        }, 
        (payload) => {
          console.log('Evolution instance changed:', payload);
          fetchInstances();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    instances,
    loading,
    fetchInstances,
    createInstance,
    updateInstanceStatus,
    deleteInstance
  };
}
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useClientStats() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalContracts: 0,
    newClientsThisMonth: 0,
    monthlyGrowth: [],
    serviceTypes: [],
    recentClients: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refetchStats = useCallback(async () => {
    try {
      setLoading(true);

      // Get total clients
      const { count: totalClients } = await supabase
        .from('dados_cliente')
        .select('*', { count: 'exact', head: true });

      // Get total appointments (contratos)
      const { count: totalContracts } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true });

      // Get new clients this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: newClientsThisMonth } = await supabase
        .from('dados_cliente')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      // Get monthly growth data
      const currentYear = new Date().getFullYear();
      const { data: monthlyData } = await supabase
        .from('dados_cliente')
        .select('created_at')
        .gte('created_at', `${currentYear}-01-01`)
        .lte('created_at', `${currentYear}-12-31`);

      // Process monthly growth
      const monthlyGrowth = [];
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      
      for (let i = 0; i < 12; i++) {
        const monthStart = new Date(currentYear, i, 1);
        const monthEnd = new Date(currentYear, i + 1, 0);
        
        const clientsInMonth = monthlyData?.filter(client => {
          const createdAt = new Date(client.created_at);
          return createdAt >= monthStart && createdAt <= monthEnd;
        }).length || 0;
        
        monthlyGrowth.push({
          month: months[i],
          clients: clientsInMonth
        });
      }

      // Get service types from appointments
      const { data: appointmentsData } = await supabase
        .from('agendamentos')
        .select('servico')
        .not('servico', 'is', null);

      // Count appointments by service type (educational context)
      const serviceCount: { [key: string]: number } = {};
      appointmentsData?.forEach(appointment => {
        if (appointment.servico) {
          const service = appointment.servico.toLowerCase();
          if (service.includes('curso')) {
            serviceCount['Cursos'] = (serviceCount['Cursos'] || 0) + 1;
          } else if (service.includes('mentoria')) {
            serviceCount['Mentorias'] = (serviceCount['Mentorias'] || 0) + 1;
          } else if (service.includes('consultoria')) {
            serviceCount['Consultorias'] = (serviceCount['Consultorias'] || 0) + 1;
          } else if (service.includes('ferramenta') || service.includes('ia') || service.includes('ai')) {
            serviceCount['Ferramentas IA'] = (serviceCount['Ferramentas IA'] || 0) + 1;
          } else if (service.includes('treinamento')) {
            serviceCount['Treinamentos'] = (serviceCount['Treinamentos'] || 0) + 1;
          } else {
            serviceCount['Outros'] = (serviceCount['Outros'] || 0) + 1;
          }
        }
      });

      // Create service types array with proper colors
      const colors = ['#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#6B7280'];
      const serviceTypes = Object.entries(serviceCount)
        .map(([service, count], index) => ({
          name: service,
          value: count,
          color: colors[index] || '#6B7280'
        }));

      // Get recent clients with correct format
      const { data: recentClientsData } = await supabase
        .from('dados_cliente')
        .select('id, nome, telefone, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Count appointments per client
      const recentClients = [];
      if (recentClientsData) {
        for (const client of recentClientsData) {
          const { count: appointmentCount } = await supabase
            .from('agendamentos')
            .select('*', { count: 'exact', head: true })
            .eq('telefone', client.telefone);

          recentClients.push({
            id: client.id,
            name: client.nome || 'Nome não informado',
            phone: client.telefone || 'Telefone não informado',
            contracts: appointmentCount || 0,
            lastVisit: client.created_at ? new Date(client.created_at).toLocaleDateString('pt-BR') : 'Data não informada'
          });
        }
      }

      setStats({
        totalClients: totalClients || 0,
        totalContracts: totalContracts || 0,
        newClientsThisMonth: newClientsThisMonth || 0,
        monthlyGrowth,
        serviceTypes,
        recentClients
      });

    } catch (error) {
      console.error('Error fetching client stats:', error);
      toast({
        title: "Erro ao carregar estatísticas",
        description: "Não foi possível carregar as estatísticas dos clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { stats, loading, refetchStats };
}

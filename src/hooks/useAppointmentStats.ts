import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AppointmentStats {
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
  appointmentsByService: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  appointmentsByMonth: Array<{
    month: string;
    appointments: number;
  }>;
  recentAppointments: Array<{
    id: number;
    nome_cliente: string;
    servico: string;
    data_agendada: string;
    status: string;
  }>;
}

export const useAppointmentStats = () => {
  const [stats, setStats] = useState<AppointmentStats>({
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    cancelledAppointments: 0,
    appointmentsByService: [],
    appointmentsByMonth: [],
    recentAppointments: []
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const refetchStats = useCallback(async () => {
    try {
      setLoading(true);

      // Get total appointments
      const { count: totalAppointments } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true });

      // Get appointments by status
      const { data: appointmentsData } = await supabase
        .from('agendamentos')
        .select('status, servico, data_agendada, created_at');

      const completedAppointments = appointmentsData?.filter(
        apt => apt.status?.toLowerCase() === 'concluído' || apt.status?.toLowerCase() === 'concluido'
      ).length || 0;

      const pendingAppointments = appointmentsData?.filter(
        apt => apt.status?.toLowerCase() === 'agendado' || apt.status?.toLowerCase() === 'pendente'
      ).length || 0;

      const cancelledAppointments = appointmentsData?.filter(
        apt => apt.status?.toLowerCase() === 'cancelado'
      ).length || 0;

      // Get appointments by service
      const serviceCount: { [key: string]: number } = {};
      appointmentsData?.forEach(appointment => {
        if (appointment.servico) {
          const service = appointment.servico;
          serviceCount[service] = (serviceCount[service] || 0) + 1;
        }
      });

      const colors = ['#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#3B82F6'];
      const appointmentsByService = Object.entries(serviceCount)
        .map(([service, count], index) => ({
          name: service,
          value: count,
          color: colors[index] || '#6B7280'
        }));

      // Get monthly appointments
      const currentYear = new Date().getFullYear();
      const monthlyAppointments = [];
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      
      for (let i = 0; i < 12; i++) {
        const monthStart = new Date(currentYear, i, 1);
        const monthEnd = new Date(currentYear, i + 1, 0);
        
        const appointmentsInMonth = appointmentsData?.filter(appointment => {
          const createdAt = new Date(appointment.created_at);
          return createdAt >= monthStart && createdAt <= monthEnd;
        }).length || 0;
        
        monthlyAppointments.push({
          month: months[i],
          appointments: appointmentsInMonth
        });
      }

      // Get recent appointments
      const { data: recentAppointments } = await supabase
        .from('agendamentos')
        .select('id, nome_cliente, servico, data_agendada, status')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalAppointments: totalAppointments || 0,
        completedAppointments,
        pendingAppointments,
        cancelledAppointments,
        appointmentsByService,
        appointmentsByMonth: monthlyAppointments,
        recentAppointments: recentAppointments || []
      });

    } catch (error) {
      console.error('Error fetching appointment stats:', error);
      toast({
        title: "Erro ao carregar estatísticas",
        description: "Não foi possível carregar as estatísticas de agendamentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    stats,
    loading,
    refetchStats
  };
};
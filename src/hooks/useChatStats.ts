import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatStats {
  totalConversations: number;
  activeConversations: number;
  totalMessages: number;
  messagesThisMonth: number;
  conversationsByMonth: Array<{
    month: string;
    conversations: number;
  }>;
  messagesByDay: Array<{
    day: string;
    messages: number;
  }>;
  topInstances: Array<{
    name: string;
    conversations: number;
  }>;
}

export const useChatStats = () => {
  const [stats, setStats] = useState<ChatStats>({
    totalConversations: 0,
    activeConversations: 0,
    totalMessages: 0,
    messagesThisMonth: 0,
    conversationsByMonth: [],
    messagesByDay: [],
    topInstances: []
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const refetchStats = useCallback(async () => {
    try {
      setLoading(true);

      // Get total conversations
      const { count: totalConversations } = await supabase
        .from('chats')
        .select('*', { count: 'exact', head: true });

      // Get active conversations (those with recent messages)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: activeConversations } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Get total messages
      const { count: totalMessages } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true });

      // Get messages this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: messagesThisMonth } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      // Get monthly conversations
      const currentYear = new Date().getFullYear();
      const { data: monthlyChats } = await supabase
        .from('chats')
        .select('created_at')
        .gte('created_at', `${currentYear}-01-01`)
        .lte('created_at', `${currentYear}-12-31`);

      const monthlyConversations = [];
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      
      for (let i = 0; i < 12; i++) {
        const monthStart = new Date(currentYear, i, 1);
        const monthEnd = new Date(currentYear, i + 1, 0);
        
        const conversationsInMonth = monthlyChats?.filter(chat => {
          const createdAt = new Date(chat.created_at);
          return createdAt >= monthStart && createdAt <= monthEnd;
        }).length || 0;
        
        monthlyConversations.push({
          month: months[i],
          conversations: conversationsInMonth
        });
      }

      // Get daily messages for the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: dailyMessages } = await supabase
        .from('chat_messages')
        .select('created_at')
        .gte('created_at', sevenDaysAgo.toISOString());

      const messagesByDay = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date();
        day.setDate(day.getDate() - i);
        const dayStr = day.toLocaleDateString('pt-BR', { weekday: 'short' });
        
        const messagesInDay = dailyMessages?.filter(message => {
          const messageDate = new Date(message.created_at);
          return messageDate.toDateString() === day.toDateString();
        }).length || 0;
        
        messagesByDay.push({
          day: dayStr,
          messages: messagesInDay
        });
      }

      // Get top instances by conversation count
      const { data: instanceData } = await supabase
        .from('chats')
        .select('instancia')
        .not('instancia', 'is', null);

      const instanceCount: { [key: string]: number } = {};
      instanceData?.forEach(chat => {
        if (chat.instancia) {
          instanceCount[chat.instancia] = (instanceCount[chat.instancia] || 0) + 1;
        }
      });

      const topInstances = Object.entries(instanceCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, conversations]) => ({
          name,
          conversations
        }));

      setStats({
        totalConversations: totalConversations || 0,
        activeConversations: activeConversations || 0,
        totalMessages: totalMessages || 0,
        messagesThisMonth: messagesThisMonth || 0,
        conversationsByMonth: monthlyConversations,
        messagesByDay,
        topInstances
      });

    } catch (error) {
      console.error('Error fetching chat stats:', error);
      toast({
        title: "Erro ao carregar estatísticas",
        description: "Não foi possível carregar as estatísticas de chat.",
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
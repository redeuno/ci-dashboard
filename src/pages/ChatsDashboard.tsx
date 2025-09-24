
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ChatLayout from '@/components/chat/ChatLayout';
import { useConversations } from '@/hooks/useConversations';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';
import { useChatMessages } from '@/hooks/useChatMessages';
import PauseDurationDialog from '@/components/PauseDurationDialog';
import { getEndpoint } from '@/utils/endpoints';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const ChatsDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Use custom hooks for data fetching and state management
  const { 
    conversations, 
    setConversations, 
    loading: conversationsLoading, 
    updateConversationLastMessage, 
    fetchConversations 
  } = useConversations();
  
  const { 
    messages, 
    loading: messagesLoading, 
    handleNewMessage 
  } = useChatMessages(selectedChat);
  
  // Set up real-time listeners for new chat messages
  useRealtimeUpdates({ 
    updateConversationLastMessage, 
    fetchConversations 
  });

  // Find the currently selected conversation
  const selectedConversation = conversations.find(conv => conv.id === selectedChat);

  const openPauseDialog = (phoneNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPhoneNumber(phoneNumber);
    setPauseDialogOpen(true);
  };

  const closePauseDialog = () => {
    setPauseDialogOpen(false);
  };

  const pauseBot = async (duration: number | null) => {
    try {
      setIsLoading(prev => ({ ...prev, [`pause-${selectedPhoneNumber}`]: true }));
      
      const response = await fetch(getEndpoint('pausaBot'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber: selectedPhoneNumber,
          duration,
          unit: 'seconds'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao pausar o bot');
      }
      
      toast({
        title: "Bot pausado",
        description: duration ? `Bot pausado com sucesso para ${selectedPhoneNumber} por ${duration} segundos` : `Bot não foi pausado para ${selectedPhoneNumber}`,
      });
      
    } catch (error) {
      console.error('Erro ao pausar bot:', error);
      toast({
        title: "Erro ao pausar bot",
        description: "Ocorreu um erro ao pausar o bot.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [`pause-${selectedPhoneNumber}`]: false }));
      closePauseDialog();
    }
  };

  const startBot = async (phoneNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsLoading(prev => ({ ...prev, [`start-${phoneNumber}`]: true }));
      
      const response = await fetch(getEndpoint('iniciaBot'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao iniciar o bot');
      }
      
      toast({
        title: "Bot ativado",
        description: `Bot ativado com sucesso para ${phoneNumber}`
      });
    } catch (error) {
      console.error('Erro ao iniciar bot:', error);
      toast({
        title: "Erro ao ativar bot",
        description: "Ocorreu um erro ao ativar o bot.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [`start-${phoneNumber}`]: false }));
    }
  };

  // Mark a conversation as read when selected
  const markConversationRead = (sessionId: string) => {
    setConversations(currentConversations => 
      currentConversations.map(conv => {
        if (conv.id === sessionId) {
          return { ...conv, unread: 0 };
        }
        return conv;
      })
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-black dark:bg-gray-800 text-white shadow-md transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Building className="h-8 w-8" style={{color: 'hsl(80, 100%, 50%)'}} />
            <h1 className="text-2xl font-bold">Comunidade Imobiliária</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-white/10 text-white border-0 px-3 py-1">
              {user?.user_metadata?.name || user?.email}
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <PauseDurationDialog 
        isOpen={pauseDialogOpen}
        onClose={closePauseDialog}
        onConfirm={pauseBot}
        phoneNumber={selectedPhoneNumber}
      />

      <div className="flex-1 overflow-hidden">
        <ChatLayout 
          conversations={conversations}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          isLoading={isLoading}
          openPauseDialog={openPauseDialog}
          startBot={startBot}
          loading={conversationsLoading || messagesLoading}
          messages={messages}
          handleNewMessage={handleNewMessage}
          selectedConversation={selectedConversation}
          markConversationRead={markConversationRead}
        />
      </div>
    </div>
  );
};

export default ChatsDashboard;

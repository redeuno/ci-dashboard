
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowLeft, LogOut, Building, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ChatStatus from './ChatStatus';

interface ChatHeaderProps {
  signOut: () => void;
}

const ChatHeader = ({ signOut }: ChatHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goBack = () => {
    navigate('/dashboard');
  };

  return (
    <header className="bg-black dark:bg-gray-800 text-white shadow-md transition-colors duration-300 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goBack} 
            className="text-white hover:bg-blue-700 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <img 
            src="/lovable-uploads/ci-logo.png" 
            alt="Comunidade Imobiliária Logo" 
            className="h-8 w-8 object-contain" 
          />
          <h1 className="text-2xl font-bold">Chats - Comunidade</h1>
        </div>
        <div className="flex items-center gap-4">
          <ChatStatus instanceName="Chatbotideal" isConnected={true} />
          <Badge variant="outline" className="bg-white/10 text-white border-0 px-3 py-1">
            {user?.user_metadata?.name || user?.email}
          </Badge>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/evolution')}
            className="text-white hover:bg-blue-700 dark:hover:bg-gray-700"
            title="Gerenciar Instâncias Evolution"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          <Button variant="outline" onClick={signOut} className="border-white text-white bg-gray-950/50 hover:bg-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;

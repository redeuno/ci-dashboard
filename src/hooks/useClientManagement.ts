
import { useState, useEffect } from 'react';
import { Contact } from '@/types/client';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { getEndpoint } from '@/utils/endpoints';
import { formatPhoneForEvolution, extractCleanPhone, isValidBrazilianPhone } from '@/utils/phoneUtils';
import { isValidDocument, isValidEmail, generateUUID } from '@/utils/validationUtils';
import { callWebhookWithRetry, logWebhookResult } from '@/utils/webhookUtils';

export const useClientManagement = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isPauseDurationDialogOpen, setIsPauseDurationDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    cpfCnpj: '',
    asaasCustomerId: '',
    status: 'Active',
    notes: '',
    creci: '',
    cep: '',
    cidade: '',
    sessionid: '',
    instancia: '',
  });

  const fetchClients = async () => {
    try {
      setLoadingContacts(true);
      
      const { data, error } = await supabase
        .from('dados_cliente')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedContacts: Contact[] = data.map(client => ({
          id: client.id.toString(),
          name: client.nome || 'Cliente sem nome',
          email: client.email,
          phone: client.telefone ? extractCleanPhone(client.telefone) : null,
          address: client.endereco,
          cpfCnpj: client.cpf_cnpj,
          asaasCustomerId: client.asaas_customer_id,
          payments: client.payments,
          status: 'Active',
          notes: client.notes || '',
          lastContact: client.created_at ? new Date(client.created_at).toLocaleDateString('pt-BR') : 'Desconhecido',
          creci: client.creci,
          cep: client.cep,
          cidade: client.cidade,
          sessionid: client.sessionid,
          instancia: client.instancia
        }));
        
        setContacts(formattedContacts);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Ocorreu um erro ao buscar os clientes do banco de dados.",
        variant: "destructive"
      });
    } finally {
      setLoadingContacts(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchClients();
    toast({
      title: "Atualizando dados",
      description: "Os dados da tabela estão sendo atualizados.",
    });
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailSheetOpen(true);
  };

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e telefone são campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Validate phone number
    if (!isValidBrazilianPhone(newContact.phone)) {
      toast({
        title: "Telefone inválido",
        description: "Por favor, insira um número de telefone brasileiro válido.",
        variant: "destructive"
      });
      return;
    }

    // Validate email if provided
    if (newContact.email && !isValidEmail(newContact.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }

    // Validate CPF/CNPJ if provided
    if (newContact.cpfCnpj && !isValidDocument(newContact.cpfCnpj)) {
      toast({
        title: "CPF/CNPJ inválido",
        description: "Por favor, insira um CPF ou CNPJ válido.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Generate automatic sessionid and set default instancia
      const sessionId = generateUUID();
      const instancia = "Chatbotideal";
      const formattedPhone = formatPhoneForEvolution(newContact.phone);

      const { data, error } = await supabase
        .from('dados_cliente')
        .insert([
          {
            nome: newContact.name,
            email: newContact.email,
            telefone: formattedPhone,
            endereco: newContact.address,
            cpf_cnpj: newContact.cpfCnpj,
            asaas_customer_id: newContact.asaasCustomerId,
            payments: newContact.payments || null,
            creci: newContact.creci,
            cep: newContact.cep,
            cidade: newContact.cidade,
            notes: newContact.notes,
            sessionid: sessionId,
            instancia: instancia
          }
        ])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newClientData = data[0];
        
        fetchClients();
        
        setNewContact({
          name: '',
          email: '',
          phone: '',
          address: '',
          cpfCnpj: '',
          asaasCustomerId: '',
          status: 'Active',
          notes: '',
          creci: '',
          cep: '',
          cidade: '',
          sessionid: '',
          instancia: '',
        });
        
        setIsAddContactOpen(false);
        
        toast({
          title: "Cliente adicionado",
          description: `${newContact.name} foi adicionado com sucesso.`,
        });
        
        // Enhanced webhook call with retry logic
        const webhookData = {
          ...newContact,
          phone: formattedPhone,
          sessionid: sessionId,
          instancia: instancia,
          id: newClientData.id
        };
        
        const webhookSuccess = await callWebhookWithRetry(
          getEndpoint('criaUsuario'), 
          webhookData
        );
        
        logWebhookResult('criaUsuario', webhookSuccess, webhookData);
        
        if (!webhookSuccess) {
          toast({
            title: "Aviso",
            description: "Cliente salvo, mas falha na sincronização com sistema externo. Dados podem precisar ser reprocessados.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      toast({
        title: "Erro ao adicionar cliente",
        description: "Não foi possível salvar o cliente no banco de dados.",
        variant: "destructive",
      });
    }
  };

  const handleEditContact = async () => {
    if (!selectedContact) return;
    
    try {
      // Validate phone if changed
      if (newContact.phone && !isValidBrazilianPhone(newContact.phone)) {
        toast({
          title: "Telefone inválido",
          description: "Por favor, insira um número de telefone brasileiro válido.",
          variant: "destructive"
        });
        return;
      }

      // Validate email if provided
      if (newContact.email && !isValidEmail(newContact.email)) {
        toast({
          title: "Email inválido", 
          description: "Por favor, insira um email válido.",
          variant: "destructive"
        });
        return;
      }

      // Validate CPF/CNPJ if provided
      if (newContact.cpfCnpj && !isValidDocument(newContact.cpfCnpj)) {
        toast({
          title: "CPF/CNPJ inválido",
          description: "Por favor, insira um CPF ou CNPJ válido.",
          variant: "destructive"
        });
        return;
      }

      const formattedPhone = newContact.phone ? formatPhoneForEvolution(newContact.phone) : selectedContact.phone;

      const { error } = await supabase
        .from('dados_cliente')
        .update({
          nome: newContact.name,
          email: newContact.email,
          telefone: formattedPhone,
          endereco: newContact.address,
          cpf_cnpj: newContact.cpfCnpj,
          asaas_customer_id: newContact.asaasCustomerId,
          payments: newContact.payments,
          creci: newContact.creci,
          cep: newContact.cep,
          cidade: newContact.cidade,
          notes: newContact.notes
        })
        .eq('id', parseInt(selectedContact.id));
      
      if (error) throw error;
      
      fetchClients();
      
      setIsEditModalOpen(false);
      
      toast({
        title: "Cliente atualizado",
        description: `As informações de ${selectedContact.name} foram atualizadas.`,
      });
      
      // Enhanced webhook call
      const webhookData = {
        id: selectedContact.id,
        ...newContact,
        phone: formattedPhone,
        sessionid: selectedContact.sessionid,
        instancia: selectedContact.instancia
      };
      
      const webhookSuccess = await callWebhookWithRetry(
        getEndpoint('editaUsuario'), 
        webhookData
      );
      
      logWebhookResult('editaUsuario', webhookSuccess, webhookData);
      
      if (!webhookSuccess) {
        toast({
          title: "Aviso",
          description: "Cliente atualizado, mas falha na sincronização com sistema externo.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: "Erro ao atualizar cliente",
        description: "Não foi possível atualizar o cliente no banco de dados.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) return;
    
    try {
      const { error } = await supabase
        .from('dados_cliente')
        .delete()
        .eq('id', parseInt(selectedContact.id));
      
      if (error) throw error;
      
      fetchClients();
      
      setSelectedContact(null);
      setIsDetailSheetOpen(false);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Cliente removido",
        description: `${selectedContact.name} foi removido da sua lista de clientes.`,
        variant: "destructive",
      });
      
      // Enhanced webhook call
      const phoneForWebhook = selectedContact.phone ? formatPhoneForEvolution(selectedContact.phone) : '';
      const webhookData = { 
        phone: phoneForWebhook,
        sessionid: selectedContact.sessionid,
        instancia: selectedContact.instancia
      };
      
      const webhookSuccess = await callWebhookWithRetry(
        getEndpoint('excluiUsuario'), 
        webhookData
      );
      
      logWebhookResult('excluiUsuario', webhookSuccess, webhookData);
      
      if (!webhookSuccess) {
        toast({
          title: "Aviso",
          description: "Cliente removido localmente, mas falha na sincronização com sistema externo.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      toast({
        title: "Erro ao remover cliente",
        description: "Não foi possível remover o cliente do banco de dados.",
        variant: "destructive",
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditModal = () => {
    if (!selectedContact) return;
    setNewContact({
      name: selectedContact.name,
      email: selectedContact.email,
      phone: selectedContact.phone,
      address: selectedContact.address,
      cpfCnpj: selectedContact.cpfCnpj,
      asaasCustomerId: selectedContact.asaasCustomerId,
      payments: selectedContact.payments,
      status: selectedContact.status,
      notes: selectedContact.notes,
      creci: selectedContact.creci,
      cep: selectedContact.cep,
      cidade: selectedContact.cidade,
    });
    setIsEditModalOpen(true);
  };

  const handleMessageClick = () => {
    setMessageText('');
    setIsMessageDialogOpen(true);
  };

  const handleMessageSubmit = () => {
    if (!messageText.trim() || !selectedContact) return;
    
    setIsMessageDialogOpen(false);
    setIsPauseDurationDialogOpen(true);
  };

  const handlePauseDurationConfirm = async (duration: number | null) => {
    if (!selectedContact) return;
    
    try {
      const response = await fetch(getEndpoint('mensagem'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: selectedContact.phone,
          message: messageText,
          pauseDuration: duration
        }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao enviar dados para o webhook');
      }
      
      setIsPauseDurationDialogOpen(false);
      
      toast({
        title: "Mensagem enviada",
        description: duration === null 
          ? `Mensagem enviada para ${selectedContact.name} sem pausar o bot.` 
          : `Mensagem enviada para ${selectedContact.name} e bot pausado por ${duration} segundos.`,
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setIsPauseDurationDialogOpen(false);
      
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar a mensagem para o servidor.",
        variant: "destructive",
      });
    }
  };
  
  useEffect(() => {
    fetchClients();
  }, []);

  return {
    contacts,
    loadingContacts,
    refreshing,
    selectedContact,
    setSelectedContact,
    isAddContactOpen,
    setIsAddContactOpen,
    isDetailSheetOpen,
    setIsDetailSheetOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isMessageDialogOpen,
    setIsMessageDialogOpen,
    isPauseDurationDialogOpen,
    setIsPauseDurationDialogOpen,
    messageText,
    setMessageText,
    newContact,
    setNewContact,
    handleRefresh,
    handleContactClick,
    handleAddContact,
    handleEditContact,
    handleDeleteContact,
    openEditModal,
    handleMessageClick,
    handleMessageSubmit,
    handlePauseDurationConfirm
  };
};

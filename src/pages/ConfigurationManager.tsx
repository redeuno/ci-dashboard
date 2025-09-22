
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

// Import centralized endpoints
import { defaultEndpoints } from '@/utils/endpoints';

const endpointGroups = {
  'Configuração Supabase': [
    { id: 'supabaseUrl', label: 'URL do Supabase', value: import.meta.env.VITE_SUPABASE_URL || '', readOnly: true },
    { id: 'supabaseKey', label: 'Chave Anônima do Supabase', value: import.meta.env.VITE_SUPABASE_ANON_KEY || '', readOnly: true }
  ],
  'Configuração da Agenda': [
    { id: 'agenda', label: 'URL Base da Agenda', key: 'agenda' },
    { id: 'agendaMentoriaCi', label: 'URL Agenda Mentoria CI', key: 'agendaMentoriaCi' },
    { id: 'agendaVendaCi', label: 'URL Agenda Venda CI', key: 'agendaVendaCi' },
    { id: 'agendaAdicionar', label: 'Adicionar Evento (Geral)', key: 'agendaAdicionar' },
    { id: 'agendaAdicionarMentoriaCi', label: 'Adicionar Evento Mentoria CI', key: 'agendaAdicionarMentoriaCi' },
    { id: 'agendaAdicionarVendaCi', label: 'Adicionar Evento Venda CI', key: 'agendaAdicionarVendaCi' },
    { id: 'agendaAlterar', label: 'Alterar Evento (Geral)', key: 'agendaAlterar' },
    { id: 'agendaAlterarMentoriaCi', label: 'Alterar Evento Mentoria CI', key: 'agendaAlterarMentoriaCi' },
    { id: 'agendaAlterarVendaCi', label: 'Alterar Evento Venda CI', key: 'agendaAlterarVendaCi' },
    { id: 'agendaExcluir', label: 'Excluir Evento (Geral)', key: 'agendaExcluir' },
    { id: 'agendaExcluirMentoriaCi', label: 'Excluir Evento Mentoria CI', key: 'agendaExcluirMentoriaCi' },
    { id: 'agendaExcluirVendaCi', label: 'Excluir Evento Venda CI', key: 'agendaExcluirVendaCi' }
  ],
  'Configuração do Bot': [
    { id: 'mensagem', label: 'Enviar Mensagem', key: 'mensagem' },
    { id: 'pausaBot', label: 'Pausar Bot', key: 'pausaBot' },
    { id: 'iniciaBot', label: 'Iniciar Bot', key: 'iniciaBot' },
    { id: 'confirma', label: 'Confirmar', key: 'confirma' }
  ],
  'Configuração RAG': [
    { id: 'enviaRag', label: 'Enviar RAG', key: 'enviaRag' },
    { id: 'excluirArquivoRag', label: 'Excluir Arquivo RAG', key: 'excluirArquivoRag' },
    { id: 'excluirRag', label: 'Excluir RAG', key: 'excluirRag' }
  ],
  'Configuração Evolution': [
    { id: 'instanciaEvolution', label: 'Instância Evolution', key: 'instanciaEvolution' },
    { id: 'atualizarQrCode', label: 'Atualizar QR Code', key: 'atualizarQrCode' }
  ],
  'Gerenciamento de Usuários': [
    { id: 'criaUsuario', label: 'Criar Usuário', key: 'criaUsuario' },
    { id: 'editaUsuario', label: 'Editar Usuário', key: 'editaUsuario' },
    { id: 'excluiUsuario', label: 'Excluir Usuário', key: 'excluiUsuario' }
  ],
  'Configuração do Agente': [
    { id: 'configAgent', label: 'Configurar Agente', key: 'configAgent' }
  ]
};

const ConfigurationManager = () => {
  const [endpoints, setEndpoints] = React.useState(() => {
    const savedEndpoints = localStorage.getItem('webhookEndpoints');
    return savedEndpoints ? JSON.parse(savedEndpoints) : defaultEndpoints;
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEndpointChange = (key: string, value: string) => {
    setEndpoints(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('webhookEndpoints', JSON.stringify(endpoints));
    toast({
      title: "Configurações salvas",
      description: "As configurações foram salvas com sucesso.",
    });
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Configurações do Sistema</h1>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          Salvar Alterações
        </Button>
      </div>

      <div className="grid gap-6">
        {Object.entries(endpointGroups).map(([groupTitle, fields]) => (
          <Card key={groupTitle} className="w-full">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">{groupTitle}</h3>
              <div className="space-y-4">
                {fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <Input
                      id={field.id}
                      value={field.readOnly ? field.value : endpoints[field.key as keyof typeof endpoints]}
                      onChange={field.readOnly ? undefined : (e) => handleEndpointChange(field.key, e.target.value)}
                      readOnly={field.readOnly}
                      className="w-full font-mono text-sm"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConfigurationManager;

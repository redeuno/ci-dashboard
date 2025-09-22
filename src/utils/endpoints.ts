// Centralized endpoint management system
// This file manages all webhook endpoints and ensures they use localStorage configuration

// Default endpoints configuration with correct subdomain
const DEFAULT_WEBHOOK_BASE = "https://endpoint.comunidadeimobiliaria.com.br/webhook";

const defaultEndpoints = {
  // Bot control endpoints
  mensagem: `${DEFAULT_WEBHOOK_BASE}/envia_mensagem`,
  pausaBot: `${DEFAULT_WEBHOOK_BASE}/pausa_bot`,
  iniciaBot: `${DEFAULT_WEBHOOK_BASE}/inicia_bot`,
  confirma: `${DEFAULT_WEBHOOK_BASE}/confirma`,

  // Agenda endpoints
  agenda: `${DEFAULT_WEBHOOK_BASE}/agenda`,
  agendaMentoriaCi: `${DEFAULT_WEBHOOK_BASE}/agenda/mentoria-ci`,
  agendaVendaCi: `${DEFAULT_WEBHOOK_BASE}/agenda/venda-ci`,
  agendaAlterar: `${DEFAULT_WEBHOOK_BASE}/agenda/alterar`,
  agendaAdicionarMentoriaCi: `${DEFAULT_WEBHOOK_BASE}/agenda/adicionar/mentoria-ci`,
  agendaAdicionarVendaCi: `${DEFAULT_WEBHOOK_BASE}/agenda/adicionar/venda-ci`,
  agendaAlterarMentoriaCi: `${DEFAULT_WEBHOOK_BASE}/agenda/alterar/mentoria-ci`,
  agendaAlterarVendaCi: `${DEFAULT_WEBHOOK_BASE}/agenda/alterar/venda-ci`,
  agendaAdicionar: `${DEFAULT_WEBHOOK_BASE}/agenda/adicionar`,
  agendaExcluir: `${DEFAULT_WEBHOOK_BASE}/agenda/excluir`,
  agendaExcluirMentoriaCi: `${DEFAULT_WEBHOOK_BASE}/agenda/excluir/mentoria-ci`,
  agendaExcluirVendaCi: `${DEFAULT_WEBHOOK_BASE}/agenda/excluir/venda-ci`,

  // RAG endpoints
  enviaRag: `${DEFAULT_WEBHOOK_BASE}/envia_rag`,
  excluirArquivoRag: `${DEFAULT_WEBHOOK_BASE}/excluir-arquivo-rag`,
  excluirRag: `${DEFAULT_WEBHOOK_BASE}/excluir-rag`,

  // Evolution endpoints
  instanciaEvolution: `${DEFAULT_WEBHOOK_BASE}/instanciaevolution`,
  atualizarQrCode: `${DEFAULT_WEBHOOK_BASE}/atualizar-qr-code`,

  // User management endpoints
  criaUsuario: `${DEFAULT_WEBHOOK_BASE}/cria_usuario`,
  editaUsuario: `${DEFAULT_WEBHOOK_BASE}/edita_usuario`,
  excluiUsuario: `${DEFAULT_WEBHOOK_BASE}/exclui_usuario`,

  // Agent configuration endpoint
  configAgent: `${DEFAULT_WEBHOOK_BASE}/config_agent`,
};

// Get endpoints from localStorage with fallback to defaults
export const getEndpoints = () => {
  const savedEndpoints = localStorage.getItem('webhookEndpoints');
  return savedEndpoints ? { ...defaultEndpoints, ...JSON.parse(savedEndpoints) } : defaultEndpoints;
};

// Get a specific endpoint URL
export const getEndpoint = (endpointKey: keyof typeof defaultEndpoints): string => {
  const endpoints = getEndpoints();
  return endpoints[endpointKey] || defaultEndpoints[endpointKey];
};

// Export default endpoints for configuration
export { defaultEndpoints };
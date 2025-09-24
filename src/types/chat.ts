
export interface Client {
  id: number;
  telefone: string;
  nome: string;
  email: string;
  sessionid: string;
  cpf_cnpj?: string;
  tipo_imovel?: string;
  localizacao_imovel?: string;
  faixa_preco?: string;
}

export interface ChatMessage {
  role: string;
  content: string;
  timestamp: string;
  type?: string;
}

export interface N8nChatHistory {
  id: number;
  session_id: string;
  message: any; // This can be various formats, we'll parse it properly
  data: string; // Date in string format (this is the timestamp field)
  instancia?: string; // Instance name
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  phone: string;
  email: string;
  address?: string;
  propertyType?: string;
  propertyLocation?: string;
  priceRange?: string;
  sessionId: string;
}

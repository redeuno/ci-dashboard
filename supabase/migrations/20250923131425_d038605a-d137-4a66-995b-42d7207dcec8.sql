-- Enable Row Level Security for all public tables and add basic policies

-- Enable RLS on agendamentos table
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Enable RLS on chat_messages table  
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Enable RLS on chats table
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

-- Enable RLS on dados_cliente table
ALTER TABLE public.dados_cliente ENABLE ROW LEVEL SECURITY;

-- Enable RLS on documents table
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Enable RLS on imagens_drive table
ALTER TABLE public.imagens_drive ENABLE ROW LEVEL SECURITY;

-- Enable RLS on n8n_chat_histories table
ALTER TABLE public.n8n_chat_histories ENABLE ROW LEVEL SECURITY;

-- Create basic policies that allow all operations for now
-- In a production environment, these should be more restrictive

-- Policies for agendamentos
CREATE POLICY "Allow all operations on agendamentos" 
ON public.agendamentos 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Policies for chat_messages
CREATE POLICY "Allow all operations on chat_messages" 
ON public.chat_messages 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Policies for chats
CREATE POLICY "Allow all operations on chats" 
ON public.chats 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Policies for dados_cliente
CREATE POLICY "Allow all operations on dados_cliente" 
ON public.dados_cliente 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Policies for documents
CREATE POLICY "Allow all operations on documents" 
ON public.documents 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Policies for imagens_drive
CREATE POLICY "Allow all operations on imagens_drive" 
ON public.imagens_drive 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Policies for n8n_chat_histories
CREATE POLICY "Allow all operations on n8n_chat_histories" 
ON public.n8n_chat_histories 
FOR ALL 
USING (true) 
WITH CHECK (true);
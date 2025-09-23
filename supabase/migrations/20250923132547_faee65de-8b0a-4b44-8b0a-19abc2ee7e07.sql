-- CORREÇÃO URGENTE DE SEGURANÇA RLS
-- Remove todas as políticas permissivas e implementa políticas baseadas em autenticação

-- Remover políticas permissivas existentes
DROP POLICY IF EXISTS "Allow all operations on agendamentos" ON public.agendamentos;
DROP POLICY IF EXISTS "Allow all operations on chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow all operations on chats" ON public.chats;
DROP POLICY IF EXISTS "Allow all operations on dados_cliente" ON public.dados_cliente;
DROP POLICY IF EXISTS "Allow all operations on documents" ON public.documents;
DROP POLICY IF EXISTS "Allow all operations on imagens_drive" ON public.imagens_drive;
DROP POLICY IF EXISTS "Allow all operations on n8n_chat_histories" ON public.n8n_chat_histories;

-- POLÍTICAS DE SEGURANÇA PARA USUÁRIOS AUTENTICADOS APENAS

-- Políticas para agendamentos - apenas usuários autenticados
CREATE POLICY "Authenticated users can view agendamentos" 
ON public.agendamentos 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert agendamentos" 
ON public.agendamentos 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update agendamentos" 
ON public.agendamentos 
FOR UPDATE 
TO authenticated
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete agendamentos" 
ON public.agendamentos 
FOR DELETE 
TO authenticated
USING (true);

-- Políticas para dados_cliente - apenas usuários autenticados
CREATE POLICY "Authenticated users can view dados_cliente" 
ON public.dados_cliente 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert dados_cliente" 
ON public.dados_cliente 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update dados_cliente" 
ON public.dados_cliente 
FOR UPDATE 
TO authenticated
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete dados_cliente" 
ON public.dados_cliente 
FOR DELETE 
TO authenticated
USING (true);

-- Políticas para chat_messages - apenas usuários autenticados
CREATE POLICY "Authenticated users can view chat_messages" 
ON public.chat_messages 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert chat_messages" 
ON public.chat_messages 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update chat_messages" 
ON public.chat_messages 
FOR UPDATE 
TO authenticated
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete chat_messages" 
ON public.chat_messages 
FOR DELETE 
TO authenticated
USING (true);

-- Políticas para chats - apenas usuários autenticados
CREATE POLICY "Authenticated users can view chats" 
ON public.chats 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert chats" 
ON public.chats 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update chats" 
ON public.chats 
FOR UPDATE 
TO authenticated
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete chats" 
ON public.chats 
FOR DELETE 
TO authenticated
USING (true);

-- Políticas para n8n_chat_histories - apenas usuários autenticados
CREATE POLICY "Authenticated users can view n8n_chat_histories" 
ON public.n8n_chat_histories 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert n8n_chat_histories" 
ON public.n8n_chat_histories 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update n8n_chat_histories" 
ON public.n8n_chat_histories 
FOR UPDATE 
TO authenticated
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete n8n_chat_histories" 
ON public.n8n_chat_histories 
FOR DELETE 
TO authenticated
USING (true);

-- Políticas para documents - apenas usuários autenticados
CREATE POLICY "Authenticated users can view documents" 
ON public.documents 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert documents" 
ON public.documents 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update documents" 
ON public.documents 
FOR UPDATE 
TO authenticated
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete documents" 
ON public.documents 
FOR DELETE 
TO authenticated
USING (true);

-- Políticas para imagens_drive - apenas usuários autenticados
CREATE POLICY "Authenticated users can view imagens_drive" 
ON public.imagens_drive 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert imagens_drive" 
ON public.imagens_drive 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update imagens_drive" 
ON public.imagens_drive 
FOR UPDATE 
TO authenticated
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete imagens_drive" 
ON public.imagens_drive 
FOR DELETE 
TO authenticated
USING (true);

-- Corrigir search_path na função match_documents para segurança adicional
CREATE OR REPLACE FUNCTION public.match_documents(query_embedding vector, match_count integer DEFAULT NULL::integer, filter jsonb DEFAULT '{}'::jsonb)
 RETURNS TABLE(id bigint, content text, metadata jsonb, similarity double precision)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$function$;
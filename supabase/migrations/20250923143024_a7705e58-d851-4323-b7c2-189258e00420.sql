-- Corrigir inconsistências de instância null no banco
UPDATE n8n_chat_histories 
SET instancia = 'Chatbotideal' 
WHERE instancia IS NULL;

-- Criar tabela para gerenciar instâncias Evolution
CREATE TABLE IF NOT EXISTS evolution_instances (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  webhook_path TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'disconnected',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  qr_code_data TEXT,
  connection_confirmed BOOLEAN DEFAULT false
);

-- Enable RLS on evolution_instances
ALTER TABLE evolution_instances ENABLE ROW LEVEL SECURITY;

-- Create policies for evolution_instances
CREATE POLICY "Authenticated users can view evolution_instances" 
ON evolution_instances 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert evolution_instances" 
ON evolution_instances 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update evolution_instances" 
ON evolution_instances 
FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated users can delete evolution_instances" 
ON evolution_instances 
FOR DELETE 
USING (true);

-- Insert the existing Chatbotideal instance
INSERT INTO evolution_instances (name, webhook_path, status, connection_confirmed)
VALUES ('Chatbotideal', '/webhook/chatbotideal', 'connected', true)
ON CONFLICT (name) DO UPDATE SET
  status = 'connected',
  connection_confirmed = true,
  updated_at = now();

-- Enable realtime for evolution_instances
ALTER TABLE evolution_instances REPLICA IDENTITY FULL;
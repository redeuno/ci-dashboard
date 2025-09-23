-- Add missing columns to dados_cliente table for better client management

-- Add notes column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'dados_cliente' AND column_name = 'notes'
  ) THEN
    ALTER TABLE dados_cliente ADD COLUMN notes TEXT;
  END IF;
END $$;

-- Add sessionid column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'dados_cliente' AND column_name = 'sessionid'
  ) THEN
    ALTER TABLE dados_cliente ADD COLUMN sessionid TEXT;
  END IF;
END $$;

-- Update existing clients without sessionid to have auto-generated UUID and default instancia
UPDATE dados_cliente 
SET 
  sessionid = gen_random_uuid()::text,
  instancia = COALESCE(instancia, 'Chatbotideal')
WHERE sessionid IS NULL OR sessionid = '';

-- Update phone numbers to Evolution format for existing clients
UPDATE dados_cliente 
SET telefone = CASE 
  WHEN telefone IS NOT NULL AND telefone != '' AND telefone NOT LIKE '%@s.whatsapp.net' 
  THEN CONCAT(
    CASE 
      WHEN LENGTH(REGEXP_REPLACE(telefone, '[^0-9]', '', 'g')) = 11 AND NOT telefone LIKE '55%'
      THEN CONCAT('55', REGEXP_REPLACE(telefone, '[^0-9]', '', 'g'))
      WHEN LENGTH(REGEXP_REPLACE(telefone, '[^0-9]', '', 'g')) = 10 AND NOT telefone LIKE '55%'
      THEN CONCAT('55', SUBSTRING(REGEXP_REPLACE(telefone, '[^0-9]', '', 'g'), 1, 2), '9', SUBSTRING(REGEXP_REPLACE(telefone, '[^0-9]', '', 'g'), 3))
      ELSE REGEXP_REPLACE(telefone, '[^0-9]', '', 'g')
    END,
    '@s.whatsapp.net'
  )
  ELSE telefone
END
WHERE telefone IS NOT NULL AND telefone != '';

-- Create index on sessionid for better performance
CREATE INDEX IF NOT EXISTS idx_dados_cliente_sessionid ON dados_cliente(sessionid);

-- Create index on telefone for better performance
CREATE INDEX IF NOT EXISTS idx_dados_cliente_telefone ON dados_cliente(telefone);
-- Enable realtime for n8n_chat_histories table
ALTER TABLE n8n_chat_histories REPLICA IDENTITY FULL;

-- Add the table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE n8n_chat_histories;
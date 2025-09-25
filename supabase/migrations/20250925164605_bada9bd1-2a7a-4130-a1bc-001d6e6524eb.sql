-- Add educational fields to dados_cliente table
ALTER TABLE public.dados_cliente 
ADD COLUMN area_interesse text,
ADD COLUMN nivel_experiencia text,
ADD COLUMN tipo_curso_desejado text;
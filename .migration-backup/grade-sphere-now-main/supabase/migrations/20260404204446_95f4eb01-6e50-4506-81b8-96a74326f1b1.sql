
ALTER TABLE public.schools ADD COLUMN class_fees jsonb NOT NULL DEFAULT '[]'::jsonb;

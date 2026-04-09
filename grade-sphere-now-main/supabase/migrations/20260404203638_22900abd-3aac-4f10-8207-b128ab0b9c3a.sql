
ALTER TABLE public.events ADD COLUMN is_public boolean NOT NULL DEFAULT true;

ALTER TABLE public.schools ADD COLUMN is_featured boolean NOT NULL DEFAULT false;

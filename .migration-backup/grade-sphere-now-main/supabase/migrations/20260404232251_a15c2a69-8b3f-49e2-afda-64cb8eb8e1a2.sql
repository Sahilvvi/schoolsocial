
-- Create school_owners table
CREATE TABLE public.school_owners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'owner',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, school_id)
);

-- Enable RLS
ALTER TABLE public.school_owners ENABLE ROW LEVEL SECURITY;

-- Admins can manage all
CREATE POLICY "Admins can manage school_owners"
ON public.school_owners FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Users can view own ownership
CREATE POLICY "Users can view own school ownership"
ON public.school_owners FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create a security definer function to check school ownership
CREATE OR REPLACE FUNCTION public.is_school_owner(_user_id UUID, _school_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.school_owners
    WHERE user_id = _user_id AND school_id = _school_id
  )
$$;

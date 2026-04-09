
-- Add verified flag to schools
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false;

-- Create tuition enquiries table
CREATE TABLE public.tuition_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL DEFAULT '',
  student_class text NOT NULL,
  subject text NOT NULL,
  area text NOT NULL DEFAULT '',
  budget text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tuition_enquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an enquiry
CREATE POLICY "Anyone can submit tuition enquiries"
ON public.tuition_enquiries FOR INSERT
TO public
WITH CHECK (true);

-- Authenticated users can view enquiries
CREATE POLICY "Authenticated users can view tuition enquiries"
ON public.tuition_enquiries FOR SELECT
TO authenticated
USING (true);

-- Admins can update enquiries
CREATE POLICY "Admins can update tuition enquiries"
ON public.tuition_enquiries FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete enquiries
CREATE POLICY "Admins can delete tuition enquiries"
ON public.tuition_enquiries FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

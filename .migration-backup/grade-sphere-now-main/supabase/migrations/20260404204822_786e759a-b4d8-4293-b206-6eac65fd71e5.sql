
CREATE POLICY "Authenticated users can insert schools"
ON public.schools
FOR INSERT
TO authenticated
WITH CHECK (true);

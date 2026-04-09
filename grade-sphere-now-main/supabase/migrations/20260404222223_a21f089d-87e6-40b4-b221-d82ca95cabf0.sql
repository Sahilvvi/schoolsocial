
-- 1. Add status column to reviews for moderation
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

-- Update existing reviews to approved
UPDATE public.reviews SET status = 'approved' WHERE status = 'pending';

-- Update the SELECT policy: public can only see approved reviews
DROP POLICY IF EXISTS "Reviews are publicly readable" ON public.reviews;
CREATE POLICY "Approved reviews are publicly readable"
ON public.reviews FOR SELECT TO public
USING (status = 'approved');

-- Admin can see all reviews
CREATE POLICY "Admins can read all reviews"
ON public.reviews FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can update reviews (approve/reject)
CREATE POLICY "Admins can update reviews"
ON public.reviews FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can delete reviews
CREATE POLICY "Admins can delete reviews"
ON public.reviews FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Create saved_schools table for parent dashboard
CREATE TABLE public.saved_schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, school_id)
);

ALTER TABLE public.saved_schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved schools"
ON public.saved_schools FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can save schools"
ON public.saved_schools FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave schools"
ON public.saved_schools FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- 3. Create school_views table for analytics
CREATE TABLE public.school_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now(),
  viewer_ip text
);

ALTER TABLE public.school_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert school views"
ON public.school_views FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "Admins can read school views"
ON public.school_views FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('school-images', 'school-images', true);

CREATE POLICY "Anyone can view school images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'school-images');

CREATE POLICY "Authenticated users can upload school images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'school-images');

CREATE POLICY "Authenticated users can update own uploads"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'school-images');

CREATE POLICY "Admins can delete school images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'school-images' AND public.has_role(auth.uid(), 'admin'::app_role));

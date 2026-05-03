
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS on user_roles: admins can read all, users can read own
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admin CRUD policies for ALL content tables

-- Schools: admin can insert, update, delete
CREATE POLICY "Admins can insert schools" ON public.schools
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update schools" ON public.schools
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete schools" ON public.schools
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Events: admin can insert, update, delete
CREATE POLICY "Admins can insert events" ON public.events
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update events" ON public.events
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete events" ON public.events
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Jobs: admin can insert, update, delete
CREATE POLICY "Admins can insert jobs" ON public.jobs
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update jobs" ON public.jobs
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete jobs" ON public.jobs
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Tutors: admin can insert, update, delete
CREATE POLICY "Admins can insert tutors" ON public.tutors
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tutors" ON public.tutors
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tutors" ON public.tutors
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- News: admin can insert, update, delete
CREATE POLICY "Admins can insert news" ON public.news
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update news" ON public.news
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete news" ON public.news
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admissions: admin can read, update, delete
CREATE POLICY "Admins can read admissions" ON public.admissions
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update admissions" ON public.admissions
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete admissions" ON public.admissions
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Job Applications: admin can read, update, delete
CREATE POLICY "Admins can read job_applications" ON public.job_applications
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update job_applications" ON public.job_applications
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete job_applications" ON public.job_applications
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Tutor Bookings: admin can read, update, delete
CREATE POLICY "Admins can read tutor_bookings" ON public.tutor_bookings
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tutor_bookings" ON public.tutor_bookings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tutor_bookings" ON public.tutor_bookings
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

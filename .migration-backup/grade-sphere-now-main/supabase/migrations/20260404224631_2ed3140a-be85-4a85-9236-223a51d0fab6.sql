
-- School plans table
CREATE TABLE public.school_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  plan_tier text NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free', 'starter', 'growth', 'elite')),
  started_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  max_photos int NOT NULL DEFAULT 5,
  max_admission_forms int NOT NULL DEFAULT 1,
  max_custom_fields int NOT NULL DEFAULT 0,
  can_post_jobs boolean NOT NULL DEFAULT false,
  can_post_events boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  priority_alerts boolean NOT NULL DEFAULT false,
  physical_qr_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(school_id)
);
ALTER TABLE public.school_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plans are publicly readable" ON public.school_plans FOR SELECT USING (true);
CREATE POLICY "Admins can manage plans" ON public.school_plans FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Custom admission forms
CREATE TABLE public.admission_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  form_name text NOT NULL DEFAULT 'Default Admission Form',
  custom_fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.admission_forms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Forms are publicly readable" ON public.admission_forms FOR SELECT USING (true);
CREATE POLICY "Admins can manage forms" ON public.admission_forms FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users can insert forms" ON public.admission_forms FOR INSERT TO authenticated WITH CHECK (true);

-- QR orders
CREATE TABLE public.qr_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  order_type text NOT NULL DEFAULT 'laminated' CHECK (order_type IN ('laminated', 'physical', 'profile_qr')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered')),
  shipping_address text NOT NULL DEFAULT '',
  contact_phone text NOT NULL DEFAULT '',
  contact_name text NOT NULL DEFAULT '',
  tracking_number text,
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.qr_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create qr orders" ON public.qr_orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can manage qr orders" ON public.qr_orders FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own qr orders" ON public.qr_orders FOR SELECT TO authenticated USING (user_id = auth.uid());

-- ERP subscriptions
CREATE TABLE public.erp_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  module_name text NOT NULL CHECK (module_name IN ('attendance', 'fee_management', 'homework_notes', 'notification_pack', 'basic_erp', 'elite_erp', 'super_erp')),
  is_active boolean NOT NULL DEFAULT true,
  started_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(school_id, module_name)
);
ALTER TABLE public.erp_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage erp subs" ON public.erp_subscriptions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can view erp subs" ON public.erp_subscriptions FOR SELECT USING (true);

-- Attendance records
CREATE TABLE public.attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  person_name text NOT NULL,
  person_type text NOT NULL DEFAULT 'student' CHECK (person_type IN ('student', 'teacher', 'staff')),
  attendance_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'leave')),
  class_name text,
  remarks text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(school_id, person_name, attendance_date)
);
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage attendance" ON public.attendance_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Fee records
CREATE TABLE public.fee_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  person_name text NOT NULL,
  person_type text NOT NULL DEFAULT 'student' CHECK (person_type IN ('student', 'teacher', 'staff')),
  amount numeric NOT NULL DEFAULT 0,
  fee_type text NOT NULL DEFAULT 'tuition' CHECK (fee_type IN ('tuition', 'transport', 'salary', 'other')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'partial')),
  due_date date,
  paid_date date,
  remarks text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.fee_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage fees" ON public.fee_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Homework & Notes
CREATE TABLE public.homework_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  class_name text NOT NULL DEFAULT '',
  file_url text,
  doc_type text NOT NULL DEFAULT 'homework' CHECK (doc_type IN ('homework', 'notes', 'study_material')),
  created_by text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.homework_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage homework" ON public.homework_notes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Tuition center plans
CREATE TABLE public.tuition_center_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
  plan_tier text NOT NULL DEFAULT 'basic' CHECK (plan_tier IN ('basic', 'pro')),
  started_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tutor_id)
);
ALTER TABLE public.tuition_center_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view tuition plans" ON public.tuition_center_plans FOR SELECT USING (true);
CREATE POLICY "Admins can manage tuition plans" ON public.tuition_center_plans FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Tuition batches
CREATE TABLE public.tuition_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
  batch_name text NOT NULL,
  subject text NOT NULL,
  schedule text NOT NULL DEFAULT '',
  max_students int NOT NULL DEFAULT 20,
  current_students int NOT NULL DEFAULT 0,
  fee_per_month numeric NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.tuition_batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Batches are publicly readable" ON public.tuition_batches FOR SELECT USING (true);
CREATE POLICY "Admins can manage batches" ON public.tuition_batches FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Notifications
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'lead_alert', 'vacancy', 'admission', 'fee_alert', 'system')),
  is_read boolean NOT NULL DEFAULT false,
  link text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all notifications" ON public.notifications FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

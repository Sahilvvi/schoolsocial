-- Migration: create marketplace tables and seed with demo data
-- Auto-generated from generated types and dummyData.ts

begin;

create table if not exists public.schools (
  about text not null,
  achievements text[] not null,
  banner text not null,
  board text not null,
  class_fees jsonb not null,
  created_at timestamptz not null default now(),
  description text not null,
  facilities text[] not null,
  fees text not null,
  gallery text[] not null,
  id text not null,
  is_featured boolean not null,
  is_verified boolean not null,
  lat numeric not null,
  lng numeric not null,
  location text not null,
  name text not null,
  rating numeric not null,
  review_count numeric not null,
  slug text not null,
  updated_at timestamptz not null default now(),
  primary key (id)
);

alter table public.schools disable row level security;

grant select, insert, update, delete on public.schools to anon;
grant select, insert, update, delete on public.schools to authenticated;
grant select, insert, update, delete on public.schools to service_role;

create table if not exists public.events (
  created_at timestamptz not null default now(),
  description text not null,
  event_date timestamptz not null,
  id text not null,
  image text not null,
  is_public boolean not null,
  location text not null,
  school_id text,
  school_name text not null,
  title text not null,
  primary key (id)
);

alter table public.events disable row level security;

grant select, insert, update, delete on public.events to anon;
grant select, insert, update, delete on public.events to authenticated;
grant select, insert, update, delete on public.events to service_role;

create table if not exists public.jobs (
  created_at timestamptz not null default now(),
  description text not null,
  id text not null,
  location text not null,
  posted_date timestamptz not null,
  salary text not null,
  school_id text,
  school_name text not null,
  title text not null,
  type text not null,
  primary key (id)
);

alter table public.jobs disable row level security;

grant select, insert, update, delete on public.jobs to anon;
grant select, insert, update, delete on public.jobs to authenticated;
grant select, insert, update, delete on public.jobs to service_role;

create table if not exists public.tutors (
  avatar text not null,
  bio text not null,
  created_at timestamptz not null default now(),
  experience text not null,
  hourly_rate text not null,
  id text not null,
  location text not null,
  name text not null,
  rating numeric not null,
  subject text not null,
  primary key (id)
);

alter table public.tutors disable row level security;

grant select, insert, update, delete on public.tutors to anon;
grant select, insert, update, delete on public.tutors to authenticated;
grant select, insert, update, delete on public.tutors to service_role;

create table if not exists public.news (
  author text not null,
  category text not null,
  created_at timestamptz not null default now(),
  excerpt text not null,
  id text not null,
  image text not null,
  published_date timestamptz not null,
  title text not null,
  primary key (id)
);

alter table public.news disable row level security;

grant select, insert, update, delete on public.news to anon;
grant select, insert, update, delete on public.news to authenticated;
grant select, insert, update, delete on public.news to service_role;

create table if not exists public.reviews (
  author text not null,
  comment text not null,
  created_at timestamptz not null default now(),
  id text not null,
  rating numeric not null,
  school_id text not null,
  status text not null,
  user_id text,
  primary key (id)
);

alter table public.reviews disable row level security;

grant select, insert, update, delete on public.reviews to anon;
grant select, insert, update, delete on public.reviews to authenticated;
grant select, insert, update, delete on public.reviews to service_role;

create table if not exists public.admissions (
  created_at timestamptz not null default now(),
  email text not null,
  grade text not null,
  id text not null,
  parent_name text not null,
  phone text not null,
  school_id text not null,
  status text not null,
  student_name text not null,
  primary key (id)
);

alter table public.admissions disable row level security;

grant select, insert, update, delete on public.admissions to anon;
grant select, insert, update, delete on public.admissions to authenticated;
grant select, insert, update, delete on public.admissions to service_role;

create table if not exists public.job_applications (
  created_at timestamptz not null default now(),
  email text not null,
  experience text not null,
  id text not null,
  job_id text not null,
  name text not null,
  phone text not null,
  primary key (id)
);

alter table public.job_applications disable row level security;

grant select, insert, update, delete on public.job_applications to anon;
grant select, insert, update, delete on public.job_applications to authenticated;
grant select, insert, update, delete on public.job_applications to service_role;

create table if not exists public.tutor_bookings (
  created_at timestamptz not null default now(),
  email text not null,
  id text not null,
  message text,
  name text not null,
  status text not null,
  tutor_id text not null,
  primary key (id)
);

alter table public.tutor_bookings disable row level security;

grant select, insert, update, delete on public.tutor_bookings to anon;
grant select, insert, update, delete on public.tutor_bookings to authenticated;
grant select, insert, update, delete on public.tutor_bookings to service_role;

create table if not exists public.tuition_enquiries (
  area text not null,
  budget text not null,
  created_at timestamptz not null default now(),
  email text not null,
  id text not null,
  message text not null,
  parent_name text not null,
  phone text not null,
  status text not null,
  student_class text not null,
  subject text not null,
  primary key (id)
);

alter table public.tuition_enquiries disable row level security;

grant select, insert, update, delete on public.tuition_enquiries to anon;
grant select, insert, update, delete on public.tuition_enquiries to authenticated;
grant select, insert, update, delete on public.tuition_enquiries to service_role;

create table if not exists public.qr_orders (
  contact_name text not null,
  contact_phone text not null,
  created_at timestamptz not null default now(),
  id text not null,
  order_type text not null,
  school_id text not null,
  shipping_address text not null,
  status text not null,
  tracking_number text,
  updated_at timestamptz not null default now(),
  user_id text,
  primary key (id)
);

alter table public.qr_orders disable row level security;

grant select, insert, update, delete on public.qr_orders to anon;
grant select, insert, update, delete on public.qr_orders to authenticated;
grant select, insert, update, delete on public.qr_orders to service_role;

create table if not exists public.tuition_batches (
  batch_name text not null,
  created_at timestamptz not null default now(),
  current_students numeric not null,
  fee_per_month numeric not null,
  id text not null,
  is_active boolean not null,
  max_students numeric not null,
  schedule text not null,
  subject text not null,
  tutor_id text not null,
  updated_at timestamptz not null default now(),
  primary key (id)
);

alter table public.tuition_batches disable row level security;

grant select, insert, update, delete on public.tuition_batches to anon;
grant select, insert, update, delete on public.tuition_batches to authenticated;
grant select, insert, update, delete on public.tuition_batches to service_role;

create table if not exists public.attendance_records (
  attendance_date timestamptz not null,
  class_name text,
  created_at timestamptz not null default now(),
  id text not null,
  person_name text not null,
  person_type text not null,
  remarks text,
  school_id text not null,
  status text not null,
  primary key (id)
);

alter table public.attendance_records disable row level security;

grant select, insert, update, delete on public.attendance_records to anon;
grant select, insert, update, delete on public.attendance_records to authenticated;
grant select, insert, update, delete on public.attendance_records to service_role;

create table if not exists public.fee_records (
  amount numeric not null,
  created_at timestamptz not null default now(),
  due_date timestamptz,
  fee_type text not null,
  id text not null,
  paid_date timestamptz,
  person_name text not null,
  person_type text not null,
  remarks text,
  school_id text not null,
  status text not null,
  primary key (id)
);

alter table public.fee_records disable row level security;

grant select, insert, update, delete on public.fee_records to anon;
grant select, insert, update, delete on public.fee_records to authenticated;
grant select, insert, update, delete on public.fee_records to service_role;

create table if not exists public.homework_notes (
  class_name text not null,
  created_at timestamptz not null default now(),
  created_by text not null,
  description text not null,
  doc_type text not null,
  file_url text,
  id text not null,
  school_id text not null,
  subject text not null,
  title text not null,
  primary key (id)
);

alter table public.homework_notes disable row level security;

grant select, insert, update, delete on public.homework_notes to anon;
grant select, insert, update, delete on public.homework_notes to authenticated;
grant select, insert, update, delete on public.homework_notes to service_role;

create table if not exists public.notifications (
  created_at timestamptz not null default now(),
  id text not null,
  is_read boolean not null,
  link text,
  message text not null,
  title text not null,
  type text not null,
  user_id text not null,
  primary key (id)
);

alter table public.notifications disable row level security;

grant select, insert, update, delete on public.notifications to anon;
grant select, insert, update, delete on public.notifications to authenticated;
grant select, insert, update, delete on public.notifications to service_role;

create table if not exists public.school_views (
  id text not null,
  school_id text not null,
  viewed_at timestamptz not null default now(),
  viewer_ip text,
  primary key (id)
);

alter table public.school_views disable row level security;

grant select, insert, update, delete on public.school_views to anon;
grant select, insert, update, delete on public.school_views to authenticated;
grant select, insert, update, delete on public.school_views to service_role;

create table if not exists public.admission_forms (
  created_at timestamptz not null default now(),
  custom_fields jsonb not null,
  form_name text not null,
  id text not null,
  is_active boolean not null,
  school_id text not null,
  updated_at timestamptz not null default now(),
  primary key (id)
);

alter table public.admission_forms disable row level security;

grant select, insert, update, delete on public.admission_forms to anon;
grant select, insert, update, delete on public.admission_forms to authenticated;
grant select, insert, update, delete on public.admission_forms to service_role;

create table if not exists public.profiles (
  avatar_url text,
  created_at timestamptz not null default now(),
  display_name text,
  id text not null,
  updated_at timestamptz not null default now(),
  user_id text not null,
  primary key (id)
);

alter table public.profiles disable row level security;

grant select, insert, update, delete on public.profiles to anon;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

create table if not exists public.user_roles (
  id text not null,
  role text not null,
  user_id text not null,
  primary key (id)
);

alter table public.user_roles disable row level security;

grant select, insert, update, delete on public.user_roles to anon;
grant select, insert, update, delete on public.user_roles to authenticated;
grant select, insert, update, delete on public.user_roles to service_role;

create table if not exists public.saved_schools (
  created_at timestamptz not null default now(),
  id text not null,
  school_id text not null,
  user_id text not null,
  primary key (id)
);

alter table public.saved_schools disable row level security;

grant select, insert, update, delete on public.saved_schools to anon;
grant select, insert, update, delete on public.saved_schools to authenticated;
grant select, insert, update, delete on public.saved_schools to service_role;

create table if not exists public.school_owners (
  created_at timestamptz not null default now(),
  id text not null,
  role text not null,
  school_id text not null,
  user_id text not null,
  primary key (id)
);

alter table public.school_owners disable row level security;

grant select, insert, update, delete on public.school_owners to anon;
grant select, insert, update, delete on public.school_owners to authenticated;
grant select, insert, update, delete on public.school_owners to service_role;

create table if not exists public.school_plans (
  can_post_events boolean not null,
  can_post_jobs boolean not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  id text not null,
  is_featured boolean not null,
  max_admission_forms numeric not null,
  max_custom_fields numeric not null,
  max_photos numeric not null,
  physical_qr_count numeric not null,
  plan_tier text not null,
  priority_alerts boolean not null,
  school_id text not null,
  started_at timestamptz not null,
  updated_at timestamptz not null default now(),
  primary key (id)
);

alter table public.school_plans disable row level security;

grant select, insert, update, delete on public.school_plans to anon;
grant select, insert, update, delete on public.school_plans to authenticated;
grant select, insert, update, delete on public.school_plans to service_role;

create table if not exists public.tuition_center_plans (
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  id text not null,
  plan_tier text not null,
  started_at timestamptz not null,
  tutor_id text not null,
  primary key (id)
);

alter table public.tuition_center_plans disable row level security;

grant select, insert, update, delete on public.tuition_center_plans to anon;
grant select, insert, update, delete on public.tuition_center_plans to authenticated;
grant select, insert, update, delete on public.tuition_center_plans to service_role;

create table if not exists public.erp_subscriptions (
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  id text not null,
  is_active boolean not null,
  module_name text not null,
  school_id text not null,
  started_at timestamptz not null,
  primary key (id)
);

alter table public.erp_subscriptions disable row level security;

grant select, insert, update, delete on public.erp_subscriptions to anon;
grant select, insert, update, delete on public.erp_subscriptions to authenticated;
grant select, insert, update, delete on public.erp_subscriptions to service_role;


-- Seed schools
insert into public.schools ("id", "name", "slug", "location", "board", "fees", "description", "about", "banner", "lat", "lng", "rating", "review_count", "is_featured", "is_verified", "facilities", "gallery", "achievements", "class_fees", "created_at", "updated_at") values ('school-001', 'Delhi Public School', 'delhi-public-school', 'Mathura Road, New Delhi', 'CBSE', '₹1,20,000/year', 'One of India''s most prestigious school chains with a legacy of academic excellence.', 'Delhi Public School was established in 1949 and has been a beacon of quality education for over 7 decades. We offer holistic development through academics, sports, arts, and community service.', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', 28.5815, 77.2507, 4.7, 156, true, true, ARRAY['Smart Classrooms', 'Olympic Pool', 'Science Labs', 'Library', 'Auditorium', 'Sports Complex', 'Computer Lab', 'Music Room']::text[], ARRAY['https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400', 'https://images.unsplash.com/photo-1562774053-701939374585?w=400', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400']::text[], ARRAY['Best CBSE School 2024', '100% Board Results', 'National Science Olympiad Winners']::text[], '{}'::jsonb, '2025-08-27T19:57:47.458Z', '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;
insert into public.schools ("id", "name", "slug", "location", "board", "fees", "description", "about", "banner", "lat", "lng", "rating", "review_count", "is_featured", "is_verified", "facilities", "gallery", "achievements", "class_fees", "created_at", "updated_at") values ('school-002', 'Modern School', 'modern-school', 'Barakhamba Road, New Delhi', 'CBSE', '₹1,50,000/year', 'A premier co-educational school known for its progressive teaching methods.', 'Modern School was founded in 1920 and is one of the oldest schools in Delhi. We focus on nurturing creativity, critical thinking, and leadership qualities in our students.', 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80', 28.6292, 77.2282, 4.5, 132, true, true, ARRAY['Science Labs', 'Art Studio', 'Sports Ground', 'Library', 'Cafeteria', 'Dance Room', 'Robotics Lab']::text[], ARRAY['https://images.unsplash.com/photo-1562774053-701939374585?w=400', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400']::text[], ARRAY['ICSE Top 10 School', 'National Debate Champions', 'Green School Award']::text[], '{}'::jsonb, '2025-10-31T19:57:47.458Z', '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;
insert into public.schools ("id", "name", "slug", "location", "board", "fees", "description", "about", "banner", "lat", "lng", "rating", "review_count", "is_featured", "is_verified", "facilities", "gallery", "achievements", "class_fees", "created_at", "updated_at") values ('school-003', 'Springdales School', 'springdales-school', 'Pusa Road, New Delhi', 'CBSE', '₹95,000/year', 'Committed to providing quality education with a focus on values and culture.', 'Springdales School believes in the holistic development of a child. Our curriculum integrates academic excellence with cultural enrichment and moral values.', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', 28.6417, 77.1849, 4.3, 89, false, true, ARRAY['Computer Lab', 'Playground', 'Library', 'Science Lab', 'Music Room']::text[], ARRAY['https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400']::text[], ARRAY['Best Value School 2024', 'State Level Sports Champions']::text[], '{}'::jsonb, '2025-12-20T19:57:47.458Z', '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;
insert into public.schools ("id", "name", "slug", "location", "board", "fees", "description", "about", "banner", "lat", "lng", "rating", "review_count", "is_featured", "is_verified", "facilities", "gallery", "achievements", "class_fees", "created_at", "updated_at") values ('school-004', 'Ryan International School', 'ryan-international', 'Sector 40, Noida', 'ICSE', '₹1,10,000/year', 'Part of a global school chain known for its international curriculum and facilities.', 'Ryan International School is part of the Ryan Group of Institutions, one of the largest school chains in India. We provide world-class education with a global perspective.', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80', 28.5708, 77.3527, 4.2, 97, true, true, ARRAY['Swimming Pool', 'Basketball Court', 'Smart Classrooms', 'Library', 'Science Labs', 'Auditorium']::text[], ARRAY['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400']::text[], ARRAY['International School Award', 'Best Sports Infrastructure']::text[], '{}'::jsonb, '2026-02-08T19:57:47.458Z', '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;
insert into public.schools ("id", "name", "slug", "location", "board", "fees", "description", "about", "banner", "lat", "lng", "rating", "review_count", "is_featured", "is_verified", "facilities", "gallery", "achievements", "class_fees", "created_at", "updated_at") values ('school-005', 'The Heritage School', 'heritage-school', 'Sector 62, Gurgaon', 'CBSE', '₹2,00,000/year', 'Premium school with state-of-the-art infrastructure and innovative teaching.', 'The Heritage School is a leading educational institution that combines academic rigor with creative expression. Our campus features cutting-edge facilities and a nurturing environment.', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80', 28.4595, 77.0266, 4.6, 78, true, true, ARRAY['AI Lab', 'Makerspace', 'Organic Garden', 'Theatre', 'Indoor Pool', 'Library', 'Sports Complex']::text[], ARRAY['https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400']::text[], ARRAY['Innovation Award 2024', 'Best Green Campus']::text[], '{}'::jsonb, '2026-02-28T19:57:47.458Z', '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;
insert into public.schools ("id", "name", "slug", "location", "board", "fees", "description", "about", "banner", "lat", "lng", "rating", "review_count", "is_featured", "is_verified", "facilities", "gallery", "achievements", "class_fees", "created_at", "updated_at") values ('school-006', 'Amity International School', 'amity-international', 'Sector 44, Noida', 'CBSE', '₹1,35,000/year', 'An Amity universe school providing holistic education with global exposure.', 'Amity International School is backed by the Amity Education Group and provides a well-rounded education that prepares students for global challenges.', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', 28.5569, 77.342, 4.4, 112, false, true, ARRAY['Robotics Lab', 'Language Lab', 'Gymnasium', 'Library', 'Smart Classrooms']::text[], '{}', ARRAY['Best Emerging School 2023']::text[], '{}'::jsonb, '2026-03-30T19:57:47.458Z', '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;
insert into public.schools ("id", "name", "slug", "location", "board", "fees", "description", "about", "banner", "lat", "lng", "rating", "review_count", "is_featured", "is_verified", "facilities", "gallery", "achievements", "class_fees", "created_at", "updated_at") values ('school-007', 'Lotus Valley International', 'lotus-valley', 'Sector 126, Noida', 'CBSE', '₹1,75,000/year', 'A school that nurtures innovation, creativity, and critical thinking.', 'Lotus Valley International School emphasizes experiential learning and provides students with opportunities to explore, innovate, and lead.', 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80', 28.5362, 77.39, 4.5, 65, false, true, ARRAY['STEM Lab', 'Observatory', 'Indoor Sports Arena', 'Library', 'Cafeteria']::text[], '{}', ARRAY['STEM Excellence Award']::text[], '{}'::jsonb, '2026-04-29T19:57:47.458Z', '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;
insert into public.schools ("id", "name", "slug", "location", "board", "fees", "description", "about", "banner", "lat", "lng", "rating", "review_count", "is_featured", "is_verified", "facilities", "gallery", "achievements", "class_fees", "created_at", "updated_at") values ('school-008', 'Sanskriti School', 'sanskriti-school', 'Chanakyapuri, New Delhi', 'CBSE', '₹80,000/year', 'Known for value-based education and cultural awareness programs.', 'Sanskriti School integrates traditional Indian values with modern education, producing well-rounded individuals who are rooted in their culture while being globally competitive.', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', 28.5961, 77.1774, 4.1, 54, false, true, ARRAY['Library', 'Computer Lab', 'Playground', 'Art Room']::text[], '{}', ARRAY['Cultural Excellence Award']::text[], '{}'::jsonb, '2026-05-19T19:57:47.458Z', '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;

-- Seed events
insert into public.events ("id", "title", "description", "event_date", "location", "school_id", "school_name", "image", "is_public", "created_at") values ('event-001', 'Annual Science Fair 2025', 'Showcase of innovative student projects in physics, chemistry, biology, and technology. Students from classes 6-12 will present their science experiments and models.', '2026-09-11', 'Delhi Public School Campus', 'school-001', 'Delhi Public School', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80', true, '2026-08-22T19:57:47.458Z') on conflict (id) do nothing;
insert into public.events ("id", "title", "description", "event_date", "location", "school_id", "school_name", "image", "is_public", "created_at") values ('event-002', 'Inter-School Debate Championship', 'Annual debate competition featuring top schools from across NCR. Topics include AI Ethics, Climate Change, and Education Reform.', '2026-09-18', 'Modern School Auditorium', 'school-002', 'Modern School', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80', true, '2026-08-24T19:57:47.459Z') on conflict (id) do nothing;
insert into public.events ("id", "title", "description", "event_date", "location", "school_id", "school_name", "image", "is_public", "created_at") values ('event-003', 'Sports Day 2025', 'Annual athletics meet featuring track & field events, team sports, and fun activities for all grades.', '2026-09-26', 'Springdales School Grounds', 'school-003', 'Springdales School', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80', true, '2026-08-20T19:57:47.459Z') on conflict (id) do nothing;
insert into public.events ("id", "title", "description", "event_date", "location", "school_id", "school_name", "image", "is_public", "created_at") values ('event-004', 'Cultural Festival - Rang Tarang', 'A celebration of art, music, dance, and drama. Students perform classical and contemporary pieces.', '2026-10-11', 'Ryan International Auditorium', 'school-004', 'Ryan International School', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', true, '2026-08-25T19:57:47.459Z') on conflict (id) do nothing;
insert into public.events ("id", "title", "description", "event_date", "location", "school_id", "school_name", "image", "is_public", "created_at") values ('event-005', 'STEM Innovation Workshop', 'Hands-on workshop on robotics, coding, and AI for students interested in technology and engineering.', '2026-09-06', 'The Heritage School STEM Lab', 'school-005', 'The Heritage School', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80', true, '2026-08-26T19:57:47.459Z') on conflict (id) do nothing;
insert into public.events ("id", "title", "description", "event_date", "location", "school_id", "school_name", "image", "is_public", "created_at") values ('event-006', 'Parent-Teacher Conference', 'Quarterly parent-teacher meeting to discuss student progress, upcoming curriculum changes, and school initiatives.', '2026-09-03', 'Amity International School Hall', 'school-006', 'Amity International School', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80', false, '2026-08-23T19:57:47.459Z') on conflict (id) do nothing;
insert into public.events ("id", "title", "description", "event_date", "location", "school_id", "school_name", "image", "is_public", "created_at") values ('event-007', 'Book Fair & Literary Fest', 'Annual book fair with author interactions, poetry recitations, creative writing contests, and storytelling sessions.', '2026-09-16', 'Delhi Public School Library', 'school-001', 'Delhi Public School', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80', true, '2026-08-21T19:57:47.459Z') on conflict (id) do nothing;
insert into public.events ("id", "title", "description", "event_date", "location", "school_id", "school_name", "image", "is_public", "created_at") values ('event-008', 'Coding Hackathon 2025', '24-hour coding challenge for high school students. Build innovative solutions for real-world problems.', '2026-10-01', 'Lotus Valley Innovation Hub', 'school-007', 'Lotus Valley International', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80', true, '2026-08-19T19:57:47.459Z') on conflict (id) do nothing;

-- Seed jobs
insert into public.jobs ("id", "title", "school_name", "school_id", "location", "type", "salary", "posted_date", "description", "created_at") values ('job-001', 'PGT Mathematics Teacher', 'Delhi Public School', 'school-001', 'New Delhi', 'Full-time', '₹45,000 - ₹65,000/month', '2026-08-24', 'We are looking for an experienced Mathematics teacher for classes 11-12. Must have M.Sc Mathematics with B.Ed and 3+ years of teaching experience.', '2026-08-24T19:57:47.459Z') on conflict (id) do nothing;
insert into public.jobs ("id", "title", "school_name", "school_id", "location", "type", "salary", "posted_date", "description", "created_at") values ('job-002', 'TGT English Teacher', 'Modern School', 'school-002', 'New Delhi', 'Full-time', '₹35,000 - ₹50,000/month', '2026-08-22', 'Seeking a creative English teacher for middle school. Must have excellent communication skills and experience with CBSE curriculum.', '2026-08-22T19:57:47.459Z') on conflict (id) do nothing;
insert into public.jobs ("id", "title", "school_name", "school_id", "location", "type", "salary", "posted_date", "description", "created_at") values ('job-003', 'Computer Science Instructor', 'The Heritage School', 'school-005', 'Gurgaon', 'Full-time', '₹50,000 - ₹75,000/month', '2026-08-26', 'Looking for a tech-savvy CS instructor to teach Python, Java, and Web Development to senior students. Experience with STEM education preferred.', '2026-08-26T19:57:47.459Z') on conflict (id) do nothing;
insert into public.jobs ("id", "title", "school_name", "school_id", "location", "type", "salary", "posted_date", "description", "created_at") values ('job-004', 'Physical Education Teacher', 'Ryan International School', 'school-004', 'Noida', 'Full-time', '₹30,000 - ₹45,000/month', '2026-08-20', 'Certified PE teacher needed for all grades. Must have experience in organizing sports events and training students for competitions.', '2026-08-20T19:57:47.459Z') on conflict (id) do nothing;
insert into public.jobs ("id", "title", "school_name", "school_id", "location", "type", "salary", "posted_date", "description", "created_at") values ('job-005', 'Art & Craft Teacher', 'Springdales School', 'school-003', 'New Delhi', 'Part-time', '₹20,000 - ₹30,000/month', '2026-08-25', 'Creative art teacher for primary classes. Should be skilled in drawing, painting, origami, and other craft activities.', '2026-08-25T19:57:47.459Z') on conflict (id) do nothing;
insert into public.jobs ("id", "title", "school_name", "school_id", "location", "type", "salary", "posted_date", "description", "created_at") values ('job-006', 'School Counselor', 'Amity International School', 'school-006', 'Noida', 'Full-time', '₹40,000 - ₹55,000/month', '2026-08-23', 'Experienced school counselor to provide emotional and academic guidance to students. M.A. Psychology with relevant certification required.', '2026-08-23T19:57:47.459Z') on conflict (id) do nothing;
insert into public.jobs ("id", "title", "school_name", "school_id", "location", "type", "salary", "posted_date", "description", "created_at") values ('job-007', 'Librarian', 'Sanskriti School', 'school-008', 'New Delhi', 'Full-time', '₹25,000 - ₹35,000/month', '2026-08-17', 'Qualified librarian to manage school library, organize book fairs, and promote reading culture. B.Lib.Sc required.', '2026-08-17T19:57:47.459Z') on conflict (id) do nothing;
insert into public.jobs ("id", "title", "school_name", "school_id", "location", "type", "salary", "posted_date", "description", "created_at") values ('job-008', 'Vice Principal', 'Delhi Public School', 'school-001', 'New Delhi', 'Full-time', '₹80,000 - ₹1,20,000/month', '2026-08-21', 'Senior leadership position requiring 15+ years of experience in education. Must have proven track record of school administration and academic leadership.', '2026-08-21T19:57:47.459Z') on conflict (id) do nothing;

-- Seed tutors
insert into public.tutors ("id", "name", "subject", "location", "experience", "hourly_rate", "rating", "avatar", "bio", "created_at") values ('tutor-001', 'Dr. Anil Verma', 'Mathematics', 'Noida, Uttar Pradesh', '15 years', '₹1,200/hr', 4.9, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', 'PhD in Mathematics from IIT Delhi. Specializes in competitive exam preparation (IIT-JEE, Olympiad). 500+ students mentored with 95% selection rate.', '2026-05-19T19:57:47.459Z') on conflict (id) do nothing;
insert into public.tutors ("id", "name", "subject", "location", "experience", "hourly_rate", "rating", "avatar", "bio", "created_at") values ('tutor-002', 'Sneha Kapoor', 'Physics', 'South Delhi, New Delhi', '8 years', '₹800/hr', 4.7, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', 'M.Sc Physics from JNU. Expert in CBSE and ICSE physics. Uses hands-on experiments to make learning fun. Available for home tuition and online classes.', '2026-06-08T19:57:47.459Z') on conflict (id) do nothing;
insert into public.tutors ("id", "name", "subject", "location", "experience", "hourly_rate", "rating", "avatar", "bio", "created_at") values ('tutor-003', 'Rahul Mehta', 'Chemistry', 'Gurgaon, Haryana', '12 years', '₹1,000/hr', 4.8, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', 'Former chemistry faculty at a leading coaching institute. Specializes in organic chemistry and NEET preparation. Interactive teaching methodology.', '2026-06-28T19:57:47.459Z') on conflict (id) do nothing;
insert into public.tutors ("id", "name", "subject", "location", "experience", "hourly_rate", "rating", "avatar", "bio", "created_at") values ('tutor-004', 'Priya Sharma', 'English', 'Dwarka, New Delhi', '10 years', '₹700/hr', 4.6, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', 'MA English Literature from DU. Certified IELTS trainer. Helps students improve communication, creative writing, and exam scores.', '2026-07-13T19:57:47.459Z') on conflict (id) do nothing;
insert into public.tutors ("id", "name", "subject", "location", "experience", "hourly_rate", "rating", "avatar", "bio", "created_at") values ('tutor-005', 'Vikram Singh', 'Computer Science', 'Noida, Uttar Pradesh', '6 years', '₹900/hr', 4.5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', 'B.Tech from NIT + 3 years industry experience at Google. Teaches Python, Java, Data Structures, and Web Development. Great for board exams and competitive coding.', '2026-07-28T19:57:47.459Z') on conflict (id) do nothing;
insert into public.tutors ("id", "name", "subject", "location", "experience", "hourly_rate", "rating", "avatar", "bio", "created_at") values ('tutor-006', 'Meera Joshi', 'Biology', 'South Delhi, New Delhi', '9 years', '₹850/hr', 4.7, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80', 'MBBS graduate turned educator. Passionate about making biology accessible. Specializes in NEET preparation with a 90% success rate.', '2026-07-18T19:57:47.459Z') on conflict (id) do nothing;

-- Seed news
insert into public.news ("id", "title", "author", "category", "published_date", "excerpt", "image", "created_at") values ('news-001', 'CBSE Announces New Exam Pattern for 2025-26', 'Education Desk', 'Policy', '2026-08-26', 'The Central Board of Secondary Education has announced significant changes to the board exam pattern including competency-based questions and internal assessment reforms.', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80', '2026-08-26T19:57:47.459Z') on conflict (id) do nothing;
insert into public.news ("id", "title", "author", "category", "published_date", "excerpt", "image", "created_at") values ('news-002', 'Top 10 Schools in Delhi NCR: Rankings 2025', 'SchoolSocial Team', 'Rankings', '2026-08-24', 'Our annual school rankings are out! Discover which schools made the cut based on academics, infrastructure, extracurriculars, and parent satisfaction.', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', '2026-08-24T19:57:47.459Z') on conflict (id) do nothing;
insert into public.news ("id", "title", "author", "category", "published_date", "excerpt", "image", "created_at") values ('news-003', 'How AI is Transforming Education in India', 'Tech Education', 'Technology', '2026-08-22', 'From personalized learning to automated grading, artificial intelligence is reshaping how Indian schools operate. Here''s what parents need to know.', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', '2026-08-22T19:57:47.459Z') on conflict (id) do nothing;
insert into public.news ("id", "title", "author", "category", "published_date", "excerpt", "image", "created_at") values ('news-004', 'Summer Camp Registrations Open Across NCR Schools', 'Events Team', 'Events', '2026-08-20', 'Looking for productive summer activities? Top schools in NCR are now accepting registrations for their summer camps featuring robotics, arts, sports, and more.', 'https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=800&q=80', '2026-08-20T19:57:47.459Z') on conflict (id) do nothing;
insert into public.news ("id", "title", "author", "category", "published_date", "excerpt", "image", "created_at") values ('news-005', 'NEP 2020 Implementation: Progress Report', 'Policy Desk', 'Policy', '2026-08-17', 'Three years into the National Education Policy, here''s a comprehensive look at what''s changed, what hasn''t, and what schools need to prepare for next.', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80', '2026-08-17T19:57:47.459Z') on conflict (id) do nothing;
insert into public.news ("id", "title", "author", "category", "published_date", "excerpt", "image", "created_at") values ('news-006', 'Parent Guide: Choosing the Right School Board', 'Admissions Expert', 'Guide', '2026-08-15', 'CBSE vs ICSE vs IB vs State Board — confused? This comprehensive guide helps parents understand the differences and choose the best board for their child.', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', '2026-08-15T19:57:47.459Z') on conflict (id) do nothing;

-- Seed reviews
insert into public.reviews ("id", "school_id", "author", "rating", "comment", "status", "user_id", "created_at") values ('rev-001', 'school-001', 'Vikram Patel', 5, 'Excellent school with amazing faculty. My son has shown tremendous improvement in academics and confidence. The facilities are world-class.', 'approved', null, '2026-08-17T19:57:47.459Z') on conflict (id) do nothing;
insert into public.reviews ("id", "school_id", "author", "rating", "comment", "status", "user_id", "created_at") values ('rev-002', 'school-001', 'Meena Singh', 4, 'Very good infrastructure and teaching quality. However, the fee structure could be more transparent. Overall a great experience.', 'approved', null, '2026-08-12T19:57:47.459Z') on conflict (id) do nothing;
insert into public.reviews ("id", "school_id", "author", "rating", "comment", "status", "user_id", "created_at") values ('rev-003', 'school-001', 'Sunita Reddy', 5, 'The best school in Delhi! Teachers are very caring and the extracurricular activities are fantastic.', 'approved', null, '2026-08-07T19:57:47.459Z') on conflict (id) do nothing;
insert into public.reviews ("id", "school_id", "author", "rating", "comment", "status", "user_id", "created_at") values ('rev-004', 'school-002', 'Deepak Sharma', 4, 'Progressive teaching methods and great campus. My daughter loves going to school every day.', 'approved', null, '2026-08-19T19:57:47.459Z') on conflict (id) do nothing;
insert into public.reviews ("id", "school_id", "author", "rating", "comment", "status", "user_id", "created_at") values ('rev-005', 'school-002', 'Neha Malhotra', 5, 'Outstanding school with a perfect balance of academics and extracurriculars. Highly recommended!', 'approved', null, '2026-08-15T19:57:47.459Z') on conflict (id) do nothing;
insert into public.reviews ("id", "school_id", "author", "rating", "comment", "status", "user_id", "created_at") values ('rev-006', 'school-003', 'Anil Verma', 4, 'Good value for money. The cultural programs are exceptional and teachers are very dedicated.', 'pending', null, '2026-08-22T19:57:47.459Z') on conflict (id) do nothing;
insert into public.reviews ("id", "school_id", "author", "rating", "comment", "status", "user_id", "created_at") values ('rev-007', 'school-004', 'Priya Joshi', 3, 'Decent school but could improve on communication with parents. Sports facilities are top-notch.', 'approved', null, '2026-08-02T19:57:47.459Z') on conflict (id) do nothing;
insert into public.reviews ("id", "school_id", "author", "rating", "comment", "status", "user_id", "created_at") values ('rev-008', 'school-005', 'Rohit Kapoor', 5, 'Premium education at its finest. The STEM lab is incredible and kids love the maker space.', 'approved', null, '2026-08-09T19:57:47.459Z') on conflict (id) do nothing;

-- Seed admissions
insert into public.admissions ("id", "school_id", "student_name", "parent_name", "email", "phone", "grade", "status", "created_at") values ('adm-001', 'school-001', 'Arjun Patel', 'Vikram Patel', 'vikram.patel@email.com', '9876543210', '6', 'approved', '2026-08-25T19:57:47.459Z') on conflict (id) do nothing;
insert into public.admissions ("id", "school_id", "student_name", "parent_name", "email", "phone", "grade", "status", "created_at") values ('adm-002', 'school-001', 'Aaradhya Singh', 'Meena Singh', 'meena.singh@email.com', '9876543211', '3', 'pending', '2026-08-26T19:57:47.459Z') on conflict (id) do nothing;
insert into public.admissions ("id", "school_id", "student_name", "parent_name", "email", "phone", "grade", "status", "created_at") values ('adm-003', 'school-001', 'Rohan Gupta', 'Amit Gupta', 'amit.gupta@email.com', '9876543212', '9', 'approved', '2026-08-22T19:57:47.459Z') on conflict (id) do nothing;
insert into public.admissions ("id", "school_id", "student_name", "parent_name", "email", "phone", "grade", "status", "created_at") values ('adm-004', 'school-001', 'Kavya Reddy', 'Sunita Reddy', 'sunita.r@email.com', '9876543213', '1', 'pending', '2026-08-24T19:57:47.459Z') on conflict (id) do nothing;
insert into public.admissions ("id", "school_id", "student_name", "parent_name", "email", "phone", "grade", "status", "created_at") values ('adm-005', 'school-001', 'Ishaan Kumar', 'Rajesh Kumar', 'rajesh.k@email.com', '9876543214', '11', 'rejected', '2026-08-19T19:57:47.459Z') on conflict (id) do nothing;
insert into public.admissions ("id", "school_id", "student_name", "parent_name", "email", "phone", "grade", "status", "created_at") values ('adm-006', 'school-002', 'Ananya Sharma', 'Deepak Sharma', 'deepak.s@email.com', '9876543215', '4', 'approved', '2026-08-23T19:57:47.459Z') on conflict (id) do nothing;
insert into public.admissions ("id", "school_id", "student_name", "parent_name", "email", "phone", "grade", "status", "created_at") values ('adm-007', 'school-002', 'Dev Malhotra', 'Neha Malhotra', 'neha.m@email.com', '9876543216', '7', 'pending', '2026-08-25T19:57:47.459Z') on conflict (id) do nothing;
insert into public.admissions ("id", "school_id", "student_name", "parent_name", "email", "phone", "grade", "status", "created_at") values ('adm-008', 'school-003', 'Saanvi Verma', 'Anil Verma', 'anil.v@email.com', '9876543217', '5', 'approved', '2026-08-21T19:57:47.459Z') on conflict (id) do nothing;
insert into public.admissions ("id", "school_id", "student_name", "parent_name", "email", "phone", "grade", "status", "created_at") values ('adm-009', 'school-004', 'Vivaan Joshi', 'Priya Joshi', 'priya.j@email.com', '9876543218', '8', 'pending', '2026-08-26T19:57:47.459Z') on conflict (id) do nothing;
insert into public.admissions ("id", "school_id", "student_name", "parent_name", "email", "phone", "grade", "status", "created_at") values ('adm-010', 'school-005', 'Myra Kapoor', 'Rohit Kapoor', 'rohit.k@email.com', '9876543219', '2', 'approved', '2026-08-18T19:57:47.459Z') on conflict (id) do nothing;

-- Seed job_applications
insert into public.job_applications ("id", "job_id", "name", "email", "phone", "experience", "created_at") values ('japp-001', 'job-001', 'Sanjay Mishra', 'sanjay.m@email.com', '9900112233', '5 years at Kendriya Vidyalaya', '2026-08-25T19:57:47.459Z') on conflict (id) do nothing;
insert into public.job_applications ("id", "job_id", "name", "email", "phone", "experience", "created_at") values ('japp-002', 'job-001', 'Nandini Rao', 'nandini.r@email.com', '9900112234', '8 years at DPS RK Puram', '2026-08-26T19:57:47.459Z') on conflict (id) do nothing;
insert into public.job_applications ("id", "job_id", "name", "email", "phone", "experience", "created_at") values ('japp-003', 'job-002', 'Aisha Khan', 'aisha.k@email.com', '9900112235', '3 years at Cambridge School', '2026-08-23T19:57:47.459Z') on conflict (id) do nothing;
insert into public.job_applications ("id", "job_id", "name", "email", "phone", "experience", "created_at") values ('japp-004', 'job-003', 'Ravi Shankar', 'ravi.s@email.com', '9900112236', '6 years at Infosys + 2 years teaching', '2026-08-26T19:57:47.459Z') on conflict (id) do nothing;
insert into public.job_applications ("id", "job_id", "name", "email", "phone", "experience", "created_at") values ('japp-005', 'job-005', 'Kavita Nair', 'kavita.n@email.com', '9900112237', '4 years at Shri Ram School', '2026-08-25T19:57:47.459Z') on conflict (id) do nothing;
insert into public.job_applications ("id", "job_id", "name", "email", "phone", "experience", "created_at") values ('japp-006', 'job-006', 'Dr. Pooja Aggarwal', 'pooja.a@email.com', '9900112238', '7 years clinical psychology + 3 years school counseling', '2026-08-24T19:57:47.459Z') on conflict (id) do nothing;

-- Seed tutor_bookings
insert into public.tutor_bookings ("id", "tutor_id", "name", "email", "message", "status", "created_at") values ('tbk-001', 'tutor-001', 'Rajesh Kumar', 'rajesh.k@email.com', 'Need maths tuition for my son in class 10. Available weekends.', 'confirmed', '2026-08-24T19:57:47.459Z') on conflict (id) do nothing;
insert into public.tutor_bookings ("id", "tutor_id", "name", "email", "message", "status", "created_at") values ('tbk-002', 'tutor-002', 'Meena Singh', 'meena.s@email.com', 'Looking for physics coaching for NEET preparation.', 'pending', '2026-08-26T19:57:47.459Z') on conflict (id) do nothing;
insert into public.tutor_bookings ("id", "tutor_id", "name", "email", "message", "status", "created_at") values ('tbk-003', 'tutor-003', 'Amit Gupta', 'amit.g@email.com', 'Chemistry tutor needed for class 12 boards.', 'confirmed', '2026-08-22T19:57:47.459Z') on conflict (id) do nothing;
insert into public.tutor_bookings ("id", "tutor_id", "name", "email", "message", "status", "created_at") values ('tbk-004', 'tutor-004', 'Sunita Reddy', 'sunita.r@email.com', 'English speaking and writing improvement for my daughter.', 'pending', '2026-08-25T19:57:47.459Z') on conflict (id) do nothing;
insert into public.tutor_bookings ("id", "tutor_id", "name", "email", "message", "status", "created_at") values ('tbk-005', 'tutor-005', 'Vikram Patel', 'vikram.p@email.com', 'Python programming classes for my son entering class 11.', 'confirmed', '2026-08-23T19:57:47.459Z') on conflict (id) do nothing;

-- Seed tuition_enquiries
insert into public.tuition_enquiries ("id", "parent_name", "phone", "email", "subject", "student_class", "area", "budget", "message", "status", "created_at") values ('tenq-001', 'Rajesh Kumar', '9876543210', 'rajesh@email.com', 'Mathematics', '10', 'Noida Sector 62', '₹5,000-8,000/month', 'Looking for a good maths tutor for board exam preparation.', 'new', '2026-08-26T19:57:47.459Z') on conflict (id) do nothing;
insert into public.tuition_enquiries ("id", "parent_name", "phone", "email", "subject", "student_class", "area", "budget", "message", "status", "created_at") values ('tenq-002', 'Priya Sharma', '9876543211', 'priya@email.com', 'Physics + Chemistry', '12', 'South Delhi', '₹10,000-15,000/month', 'Need coaching for JEE Mains preparation.', 'contacted', '2026-08-24T19:57:47.459Z') on conflict (id) do nothing;
insert into public.tuition_enquiries ("id", "parent_name", "phone", "email", "subject", "student_class", "area", "budget", "message", "status", "created_at") values ('tenq-003', 'Amit Verma', '9876543212', 'amit@email.com', 'English', '5', 'Dwarka', '₹3,000-5,000/month', 'My child needs help with English reading and writing.', 'new', '2026-08-25T19:57:47.459Z') on conflict (id) do nothing;
insert into public.tuition_enquiries ("id", "parent_name", "phone", "email", "subject", "student_class", "area", "budget", "message", "status", "created_at") values ('tenq-004', 'Neha Joshi', '9876543213', 'neha@email.com', 'Computer Science', '11', 'Gurgaon', '₹8,000-12,000/month', 'Looking for Python and Java programming classes.', 'converted', '2026-08-20T19:57:47.459Z') on conflict (id) do nothing;

-- Seed qr_orders
insert into public.qr_orders ("id", "school_id", "order_type", "shipping_address", "contact_name", "contact_phone", "status", "tracking_number", "user_id", "created_at", "updated_at") values ('qr-001', 'school-001', 'standard_standee', 'Delhi Public School, Mathura Road, New Delhi - 110003', 'Admin Office', '011-24379000', 'delivered', 'DTDC12345', null, '2026-07-28T19:57:47.459Z', '2026-08-02T19:57:47.459Z') on conflict (id) do nothing;
insert into public.qr_orders ("id", "school_id", "order_type", "shipping_address", "contact_name", "contact_phone", "status", "tracking_number", "user_id", "created_at", "updated_at") values ('qr-002', 'school-002', 'premium_poster', 'Modern School, Barakhamba Road, New Delhi - 110001', 'Reception Desk', '011-23311066', 'shipped', 'DTDC12346', null, '2026-08-17T19:57:47.459Z', '2026-08-20T19:57:47.459Z') on conflict (id) do nothing;
insert into public.qr_orders ("id", "school_id", "order_type", "shipping_address", "contact_name", "contact_phone", "status", "tracking_number", "user_id", "created_at", "updated_at") values ('qr-003', 'school-004', 'standard_standee', 'Ryan International, Sector 40, Noida - 201303', 'Office Manager', '0120-4567890', 'processing', null, null, '2026-08-24T19:57:47.459Z', '2026-08-24T19:57:47.459Z') on conflict (id) do nothing;
insert into public.qr_orders ("id", "school_id", "order_type", "shipping_address", "contact_name", "contact_phone", "status", "tracking_number", "user_id", "created_at", "updated_at") values ('qr-004', 'school-005', 'premium_poster', 'The Heritage School, Sector 62, Gurgaon - 122011', 'Marketing Head', '0124-4567890', 'pending', null, null, '2026-08-26T19:57:47.459Z', '2026-08-26T19:57:47.459Z') on conflict (id) do nothing;

-- Seed tuition_batches
insert into public.tuition_batches ("id", "tutor_id", "batch_name", "subject", "schedule", "max_students", "current_students", "fee_per_month", "is_active", "created_at", "updated_at") values ('batch-001', 'tutor-001', 'JEE Maths Batch A', 'Mathematics', 'Mon, Wed, Fri 4-6 PM', 15, 12, 8000, true, '2026-06-28T19:57:47.459Z', '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;
insert into public.tuition_batches ("id", "tutor_id", "batch_name", "subject", "schedule", "max_students", "current_students", "fee_per_month", "is_active", "created_at", "updated_at") values ('batch-002', 'tutor-001', 'Board Maths Class 10', 'Mathematics', 'Tue, Thu, Sat 5-7 PM', 20, 18, 5000, true, '2026-07-13T19:57:47.459Z', '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;
insert into public.tuition_batches ("id", "tutor_id", "batch_name", "subject", "schedule", "max_students", "current_students", "fee_per_month", "is_active", "created_at", "updated_at") values ('batch-003', 'tutor-002', 'NEET Physics Crash', 'Physics', 'Daily 3-5 PM', 25, 22, 10000, true, '2026-07-28T19:57:47.459Z', '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;
insert into public.tuition_batches ("id", "tutor_id", "batch_name", "subject", "schedule", "max_students", "current_students", "fee_per_month", "is_active", "created_at", "updated_at") values ('batch-004', 'tutor-003', 'Organic Chemistry', 'Chemistry', 'Mon, Wed, Fri 6-8 PM', 12, 10, 7000, true, '2026-07-18T19:57:47.459Z', '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;
insert into public.tuition_batches ("id", "tutor_id", "batch_name", "subject", "schedule", "max_students", "current_students", "fee_per_month", "is_active", "created_at", "updated_at") values ('batch-005', 'tutor-005', 'Python Programming', 'Computer Science', 'Sat, Sun 10 AM-12 PM', 10, 8, 6000, true, '2026-08-07T19:57:47.459Z', '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;

-- Seed attendance_records
insert into public.attendance_records ("id", "school_id", "person_name", "person_type", "attendance_date", "status", "class_name", "remarks", "created_at") values ('att-001', 'school-001', 'Arjun Patel', 'student', '2026-08-27', 'present', '6A', null, '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;
insert into public.attendance_records ("id", "school_id", "person_name", "person_type", "attendance_date", "status", "class_name", "remarks", "created_at") values ('att-002', 'school-001', 'Aaradhya Singh', 'student', '2026-08-27', 'present', '3B', null, '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;
insert into public.attendance_records ("id", "school_id", "person_name", "person_type", "attendance_date", "status", "class_name", "remarks", "created_at") values ('att-003', 'school-001', 'Rohan Gupta', 'student', '2026-08-27', 'absent', '9A', 'Sick leave', '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;
insert into public.attendance_records ("id", "school_id", "person_name", "person_type", "attendance_date", "status", "class_name", "remarks", "created_at") values ('att-004', 'school-001', 'Kavya Reddy', 'student', '2026-08-27', 'present', '1A', null, '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;
insert into public.attendance_records ("id", "school_id", "person_name", "person_type", "attendance_date", "status", "class_name", "remarks", "created_at") values ('att-005', 'school-001', 'Ishaan Kumar', 'student', '2026-08-27', 'late', '11A', 'Came 15 min late', '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;
insert into public.attendance_records ("id", "school_id", "person_name", "person_type", "attendance_date", "status", "class_name", "remarks", "created_at") values ('att-006', 'school-001', 'Priya Sharma', 'teacher', '2026-08-27', 'present', null, null, '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;
insert into public.attendance_records ("id", "school_id", "person_name", "person_type", "attendance_date", "status", "class_name", "remarks", "created_at") values ('att-007', 'school-001', 'Dr. Anil Verma', 'teacher', '2026-08-27', 'present', null, null, '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;
insert into public.attendance_records ("id", "school_id", "person_name", "person_type", "attendance_date", "status", "class_name", "remarks", "created_at") values ('att-008', 'school-001', 'Sneha Kapoor', 'teacher', '2026-08-27', 'absent', null, 'Medical leave', '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;

-- Seed fee_records
insert into public.fee_records ("id", "school_id", "person_name", "person_type", "amount", "fee_type", "status", "due_date", "paid_date", "remarks", "created_at") values ('fee-001', 'school-001', 'Arjun Patel', 'student', 30000, 'Tuition Fee', 'paid', '2026-08-12', '2026-08-15', 'Q1 Fee', '2026-08-12T19:57:47.459Z') on conflict (id) do nothing;
insert into public.fee_records ("id", "school_id", "person_name", "person_type", "amount", "fee_type", "status", "due_date", "paid_date", "remarks", "created_at") values ('fee-002', 'school-001', 'Aaradhya Singh', 'student', 30000, 'Tuition Fee', 'paid', '2026-08-12', '2026-08-17', 'Q1 Fee', '2026-08-12T19:57:47.459Z') on conflict (id) do nothing;
insert into public.fee_records ("id", "school_id", "person_name", "person_type", "amount", "fee_type", "status", "due_date", "paid_date", "remarks", "created_at") values ('fee-003', 'school-001', 'Rohan Gupta', 'student', 30000, 'Tuition Fee', 'overdue', '2026-08-12', null, 'Q1 Fee - Reminder sent', '2026-08-12T19:57:47.459Z') on conflict (id) do nothing;
insert into public.fee_records ("id", "school_id", "person_name", "person_type", "amount", "fee_type", "status", "due_date", "paid_date", "remarks", "created_at") values ('fee-004', 'school-001', 'Kavya Reddy', 'student', 15000, 'Transport Fee', 'paid', '2026-08-07', '2026-08-09', 'Semester 1', '2026-08-07T19:57:47.459Z') on conflict (id) do nothing;
insert into public.fee_records ("id", "school_id", "person_name", "person_type", "amount", "fee_type", "status", "due_date", "paid_date", "remarks", "created_at") values ('fee-005', 'school-001', 'Ishaan Kumar', 'student', 30000, 'Tuition Fee', 'pending', '2026-09-01', null, 'Q2 Fee', '2026-08-25T19:57:47.459Z') on conflict (id) do nothing;
insert into public.fee_records ("id", "school_id", "person_name", "person_type", "amount", "fee_type", "status", "due_date", "paid_date", "remarks", "created_at") values ('fee-006', 'school-001', 'Arjun Patel', 'student', 5000, 'Lab Fee', 'paid', '2026-07-28', '2026-07-30', 'Annual lab charges', '2026-07-28T19:57:47.459Z') on conflict (id) do nothing;

-- Seed homework_notes
insert into public.homework_notes ("id", "school_id", "title", "description", "subject", "class_name", "doc_type", "file_url", "created_by", "created_at") values ('hw-001', 'school-001', 'Chapter 5 - Linear Equations', 'Complete exercises 5.1 to 5.4 from NCERT textbook. Show all steps clearly.', 'Mathematics', '9A', 'homework', null, 'Priya Sharma', '2026-08-26T19:57:47.459Z') on conflict (id) do nothing;
insert into public.homework_notes ("id", "school_id", "title", "description", "subject", "class_name", "doc_type", "file_url", "created_by", "created_at") values ('hw-002', 'school-001', 'Essay: My Role Model', 'Write a 500-word essay about your role model. Include specific examples of their qualities that inspire you.', 'English', '6A', 'homework', null, 'Sneha Kapoor', '2026-08-25T19:57:47.459Z') on conflict (id) do nothing;
insert into public.homework_notes ("id", "school_id", "title", "description", "subject", "class_name", "doc_type", "file_url", "created_by", "created_at") values ('hw-003', 'school-001', 'Science Lab Report - Photosynthesis', 'Submit the lab report for the photosynthesis experiment conducted in class. Include observations, data table, and conclusion.', 'Science', '8B', 'homework', null, 'Dr. Anil Verma', '2026-08-24T19:57:47.459Z') on conflict (id) do nothing;
insert into public.homework_notes ("id", "school_id", "title", "description", "subject", "class_name", "doc_type", "file_url", "created_by", "created_at") values ('hw-004', 'school-001', 'Class Notes: French Revolution', 'Comprehensive notes covering the causes, events, and outcomes of the French Revolution.', 'History', '9A', 'notes', null, 'Rahul Mehta', '2026-08-23T19:57:47.459Z') on conflict (id) do nothing;
insert into public.homework_notes ("id", "school_id", "title", "description", "subject", "class_name", "doc_type", "file_url", "created_by", "created_at") values ('hw-005', 'school-001', 'Practice Worksheet: Trigonometry', 'Additional practice problems for trigonometric identities and applications.', 'Mathematics', '11A', 'worksheet', null, 'Priya Sharma', '2026-08-22T19:57:47.459Z') on conflict (id) do nothing;

-- Seed notifications
insert into public.notifications ("id", "user_id", "title", "message", "type", "link", "is_read", "created_at") values ('notif-001', 'demo-parent-001', 'Admission Approved', 'Your child Arjun Patel''s admission to Class 6A has been approved.', 'admission', '/dashboard', false, '2026-08-26T19:57:47.459Z') on conflict (id) do nothing;
insert into public.notifications ("id", "user_id", "title", "message", "type", "link", "is_read", "created_at") values ('notif-002', 'demo-parent-001', 'Fee Reminder', 'Q2 tuition fee of ₹30,000 is due in 5 days.', 'fee', '/dashboard', false, '2026-08-25T19:57:47.459Z') on conflict (id) do nothing;
insert into public.notifications ("id", "user_id", "title", "message", "type", "link", "is_read", "created_at") values ('notif-003', 'demo-parent-001', 'New Homework Assigned', 'Mathematics homework: Linear Equations exercises assigned for Class 9A.', 'homework', '/dashboard', true, '2026-08-24T19:57:47.459Z') on conflict (id) do nothing;
insert into public.notifications ("id", "user_id", "title", "message", "type", "link", "is_read", "created_at") values ('notif-004', 'demo-parent-001', 'Event Reminder', 'Annual Science Fair is happening in 15 days at DPS Campus.', 'event', '/events', true, '2026-08-23T19:57:47.459Z') on conflict (id) do nothing;
insert into public.notifications ("id", "user_id", "title", "message", "type", "link", "is_read", "created_at") values ('notif-005', 'demo-school-001', 'New Admission Request', 'Kavya Reddy has applied for Class 1 admission.', 'admission', '/school-panel/admissions', false, '2026-08-26T19:57:47.459Z') on conflict (id) do nothing;
insert into public.notifications ("id", "user_id", "title", "message", "type", "link", "is_read", "created_at") values ('notif-006', 'demo-school-001', 'New Review', 'Vikram Patel left a 5-star review for your school.', 'review', '/school-panel/reviews', false, '2026-08-25T19:57:47.459Z') on conflict (id) do nothing;
insert into public.notifications ("id", "user_id", "title", "message", "type", "link", "is_read", "created_at") values ('notif-007', 'demo-admin-001', 'New School Registration', 'Lotus Valley International has registered on the platform.', 'school', '/admin/schools', false, '2026-08-26T19:57:47.459Z') on conflict (id) do nothing;
insert into public.notifications ("id", "user_id", "title", "message", "type", "link", "is_read", "created_at") values ('notif-008', 'demo-admin-001', 'QR Order Received', 'New QR standee order from The Heritage School.', 'order', '/admin/qr-orders', true, '2026-08-24T19:57:47.459Z') on conflict (id) do nothing;

-- Seed school_views
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-001', 'school-001', '2026-08-21T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-002', 'school-001', '2026-08-08T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-003', 'school-001', '2026-08-12T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-004', 'school-001', '2026-08-03T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-005', 'school-001', '2026-08-07T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-006', 'school-001', '2026-08-16T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-007', 'school-001', '2026-08-04T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-008', 'school-001', '2026-08-13T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-009', 'school-001', '2026-08-09T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-010', 'school-001', '2026-08-08T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-011', 'school-001', '2026-08-05T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-012', 'school-001', '2026-08-25T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-013', 'school-001', '2026-08-15T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-014', 'school-001', '2026-08-14T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-015', 'school-001', '2026-08-03T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-016', 'school-001', '2026-08-13T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-017', 'school-001', '2026-08-27T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-018', 'school-001', '2026-07-30T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-019', 'school-001', '2026-08-19T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-020', 'school-001', '2026-08-01T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-021', 'school-001', '2026-08-26T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-022', 'school-001', '2026-07-29T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-023', 'school-001', '2026-08-25T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-024', 'school-001', '2026-08-27T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-025', 'school-001', '2026-08-05T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-026', 'school-001', '2026-08-14T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-027', 'school-001', '2026-08-23T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-028', 'school-001', '2026-08-17T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-029', 'school-001', '2026-08-10T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-030', 'school-001', '2026-08-20T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-031', 'school-001', '2026-08-21T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-032', 'school-001', '2026-08-16T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-033', 'school-001', '2026-08-10T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-034', 'school-001', '2026-08-21T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-035', 'school-001', '2026-08-19T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-036', 'school-001', '2026-08-17T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-037', 'school-001', '2026-08-06T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-038', 'school-001', '2026-08-16T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-039', 'school-001', '2026-08-16T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-040', 'school-001', '2026-08-22T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-041', 'school-001', '2026-08-09T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-042', 'school-001', '2026-07-31T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-043', 'school-001', '2026-07-30T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-044', 'school-001', '2026-07-31T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-045', 'school-001', '2026-08-15T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-046', 'school-001', '2026-08-18T19:57:47.459Z', null) on conflict (id) do nothing;
insert into public.school_views ("id", "school_id", "viewed_at", "viewer_ip") values ('view-047', 'school-001', '2026-08-05T19:57:47.459Z', null) on conflict (id) do nothing;

-- Seed admission_forms
insert into public.admission_forms ("id", "school_id", "form_name", "is_active", "custom_fields", "created_at", "updated_at") values ('aform-001', 'school-001', 'General Admission 2025-26', true, '[{"label":"Previous School","type":"text"},{"label":"Sibling at DPS?","type":"checkbox"}]'::jsonb, '2026-07-28T19:57:47.459Z', '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;
insert into public.admission_forms ("id", "school_id", "form_name", "is_active", "custom_fields", "created_at", "updated_at") values ('aform-002', 'school-001', 'Late Admission Form', true, '[{"label":"Reason for Late Application","type":"textarea"}]'::jsonb, '2026-08-12T19:57:47.459Z', '2026-08-27T19:57:47.458Z') on conflict (id) do nothing;

-- Seed profiles and user_roles from demo users
insert into public.profiles (id, user_id, display_name, avatar_url, created_at, updated_at) values ('demo-admin-001', 'demo-admin-001', 'Admin User', null, now(), now()) on conflict (id) do nothing;
insert into public.user_roles (id, user_id, role) values (gen_random_uuid()::text, 'demo-admin-001', 'admin') on conflict (id) do nothing;
insert into public.profiles (id, user_id, display_name, avatar_url, created_at, updated_at) values ('demo-school-001', 'demo-school-001', 'School Manager', null, now(), now()) on conflict (id) do nothing;
insert into public.user_roles (id, user_id, role) values (gen_random_uuid()::text, 'demo-school-001', 'user') on conflict (id) do nothing;
insert into public.profiles (id, user_id, display_name, avatar_url, created_at, updated_at) values ('demo-parent-001', 'demo-parent-001', 'Rajesh Kumar', null, now(), now()) on conflict (id) do nothing;
insert into public.user_roles (id, user_id, role) values (gen_random_uuid()::text, 'demo-parent-001', 'user') on conflict (id) do nothing;
insert into public.profiles (id, user_id, display_name, avatar_url, created_at, updated_at) values ('demo-teacher-001', 'demo-teacher-001', 'Priya Sharma', null, now(), now()) on conflict (id) do nothing;
insert into public.user_roles (id, user_id, role) values (gen_random_uuid()::text, 'demo-teacher-001', 'user') on conflict (id) do nothing;
insert into public.profiles (id, user_id, display_name, avatar_url, created_at, updated_at) values ('demo-tuition-001', 'demo-tuition-001', 'Tuition Center Admin', null, now(), now()) on conflict (id) do nothing;
insert into public.user_roles (id, user_id, role) values (gen_random_uuid()::text, 'demo-tuition-001', 'user') on conflict (id) do nothing;

commit;

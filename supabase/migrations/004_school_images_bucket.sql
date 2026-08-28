-- Create the public school-images storage bucket used by UploadSchoolPage and ERP Gallery
begin;

insert into storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
values (
  'school-images',
  'school-images',
  true,
  false,
  52428800,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Public read access for images used in school listings and galleries
drop policy if exists "Allow public reads from school-images" on storage.objects;
create policy "Allow public reads from school-images"
on storage.objects for select to public
using ( bucket_id = 'school-images' );

-- Allow anonymous uploads from the demo marketplace / ERP uploads
-- Replace 'to public' with 'to authenticated' once real Supabase Auth is wired
drop policy if exists "Allow public uploads to school-images" on storage.objects;
create policy "Allow public uploads to school-images"
on storage.objects for insert to public
with check ( bucket_id = 'school-images' );

drop policy if exists "Allow public updates in school-images" on storage.objects;
create policy "Allow public updates in school-images"
on storage.objects for update to public
using ( bucket_id = 'school-images' )
with check ( bucket_id = 'school-images' );

drop policy if exists "Allow public deletes in school-images" on storage.objects;
create policy "Allow public deletes in school-images"
on storage.objects for delete to public
using ( bucket_id = 'school-images' );

commit;

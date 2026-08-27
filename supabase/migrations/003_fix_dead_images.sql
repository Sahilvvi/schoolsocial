-- Fix dead Unsplash image URLs in marketplace seed data
begin;

update public.schools
set banner = replace(banner, 'photo-1523050854058-8df90110c476', 'photo-1580582932707-520aed937b7b')
where banner like '%photo-1523050854058-8df90110c476%';

update public.schools
set gallery = array_replace(gallery,
  'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=400',
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400');

update public.news
set image = replace(image, 'photo-1523050854058-8df90110c476', 'photo-1580582932707-520aed937b7b')
where image like '%photo-1523050854058-8df90110c476%';

update public.events
set image = replace(image, 'photo-1461896836934-bd45ba24e916', 'photo-1509062522246-3755977927d7')
where image like '%photo-1461896836934-bd45ba24e916%';

update public.events
set image = replace(image, 'photo-1564429238961-bf8e8a1e4c16', 'photo-1581092918056-0c4c3acd3789')
where image like '%photo-1564429238961-bf8e8a1e4c16%';

commit;

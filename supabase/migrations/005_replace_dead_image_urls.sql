-- Replace dead external placeholder/unsplash image URLs in seed data with a local data-URI placeholder
begin;

with placeholder as (
  select 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjIwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=='::text as uri
)
update public.schools
set banner = regexp_replace(banner, 'https?://(images\.unsplash\.com|via\.placeholder\.com|picsum\.photos)/[^ ]+', p.uri, 'g')
from placeholder p
where banner ~ 'https?://(images\.unsplash\.com|via\.placeholder\.com|picsum\.photos)/';

with placeholder as (
  select 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjIwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=='::text as uri
)
update public.schools
set gallery = coalesce((
  select array_agg(regexp_replace(x, 'https?://(images\.unsplash\.com|via\.placeholder\.com|picsum\.photos)/[^ ]+', p.uri, 'g'))
  from unnest(gallery) as x
), '{}')
from placeholder p
where gallery::text ~ 'https?://(images\.unsplash\.com|via\.placeholder\.com|picsum\.photos)/';

with placeholder as (
  select 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjIwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=='::text as uri
)
update public.events
set image = regexp_replace(image, 'https?://(images\.unsplash\.com|via\.placeholder\.com|picsum\.photos)/[^ ]+', p.uri, 'g')
from placeholder p
where image ~ 'https?://(images\.unsplash\.com|via\.placeholder\.com|picsum\.photos)/';

with placeholder as (
  select 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjIwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=='::text as uri
)
update public.news
set image = regexp_replace(image, 'https?://(images\.unsplash\.com|via\.placeholder\.com|picsum\.photos)/[^ ]+', p.uri, 'g')
from placeholder p
where image ~ 'https?://(images\.unsplash\.com|via\.placeholder\.com|picsum\.photos)/';

with placeholder as (
  select 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjIwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=='::text as uri
)
update public.tutors
set avatar = regexp_replace(avatar, 'https?://(images\.unsplash\.com|via\.placeholder\.com|picsum\.photos)/[^ ]+', p.uri, 'g')
from placeholder p
where avatar ~ 'https?://(images\.unsplash\.com|via\.placeholder\.com|picsum\.photos)/';

commit;

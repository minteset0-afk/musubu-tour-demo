create table public.shops (
 shop_id text primary key,
 name text not null,
 category text not null check (category in ('dessert','meal','gift')),
 image_url text not null,
 address text not null,
 business_hours text not null,
 phone text not null,
 products jsonb not null,
 external_url text not null,
 map_url text not null,
 description text not null,
 is_demo boolean not null default true
);
create table public.reviews (
 id uuid primary key default gen_random_uuid(),
 shop_id text not null references public.shops(shop_id),
 rating smallint not null check (rating between 1 and 5),
 review_text text not null check (char_length(btrim(review_text)) between 2 and 500),
 created_at timestamptz not null default now(),
 request_id uuid not null unique
);
create index reviews_shop_created_idx on public.reviews (shop_id, created_at desc, id);
alter table public.shops enable row level security;
alter table public.reviews enable row level security;
revoke all on public.shops, public.reviews from anon, authenticated;
grant select on public.shops, public.reviews to anon;
grant insert (shop_id, rating, review_text, request_id) on public.reviews to anon;
create policy shops_public_read on public.shops for select to anon using (true);
create policy reviews_public_read on public.reviews for select to anon using (true);
create policy reviews_anon_insert on public.reviews for insert to anon
 with check (rating between 1 and 5 and char_length(btrim(review_text)) between 2 and 500);
create function public.shop_review_stats()
returns table (shop_id text, review_count bigint, average_rating numeric)
language sql stable security invoker set search_path = ''
as $$
 select s.shop_id, count(r.id), round(avg(r.rating),1)
 from public.shops s left join public.reviews r on s.shop_id = r.shop_id
 group by s.shop_id;
$$;
revoke all on function public.shop_review_stats() from public, authenticated;
grant execute on function public.shop_review_stats() to anon;
alter publication supabase_realtime add table public.reviews;

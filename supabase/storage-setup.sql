-- Run this in Supabase SQL Editor after creating a bucket named `csrhub-assets`.
-- This keeps uploads simple for the current server-side upload flow.

insert into storage.buckets (id, name, public)
values ('csrhub-assets', 'csrhub-assets', true)
on conflict (id) do nothing;

create policy "Public can view csrhub assets"
on storage.objects
for select
to public
using (bucket_id = 'csrhub-assets');

create policy "Authenticated users can upload csrhub assets"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'csrhub-assets');

create policy "Authenticated users can update csrhub assets"
on storage.objects
for update
to authenticated
using (bucket_id = 'csrhub-assets')
with check (bucket_id = 'csrhub-assets');

create policy "Authenticated users can delete csrhub assets"
on storage.objects
for delete
to authenticated
using (bucket_id = 'csrhub-assets');

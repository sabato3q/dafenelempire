insert into public.products (name, price, description, image_url, available)
select 'Herbal Detox Tea', 500, 'Ginger and other healthy herbs for a refreshing tea experience.', 'assets/herbal-detox-tea.jpg', true
where not exists (select 1 from public.products where name = 'Herbal Detox Tea');

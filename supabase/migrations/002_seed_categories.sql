insert into public.categories(name,slug) values
('خدمات','services'),('کالا','goods'),('اجاره','rent'),('آموزش','education'),('سلامت','health'),('حمل‌ونقل','transport'),('مسکن','housing'),('کار','jobs')
on conflict (slug) do nothing;

insert into public.tags(name,slug) values
('فوری','urgent'),('محلی','local'),('عمده','wholesale'),('اعتماد','trust'),('قیمت','price'),('تعمیرات','repair')
on conflict (slug) do nothing;

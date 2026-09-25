-- MIZ Stage 16 seed: public calibration dataset
insert into public.categories (name, slug) values
('معیشت و رفاه','livelihood'),('سلامت','health'),('آموزش','education'),('اشتغال','employment'),('مسکن','housing'),('حمل‌ونقل','transport'),('خدمات عمومی','public-services')
on conflict (slug) do nothing;

insert into public.sources (title,url,publisher,source_type,published_at,authority_level,verified)
select 'Poverty and Inequality Platform — September 2026 update','https://pip.worldbank.org/about','World Bank Group','official_dataset','2026-09-22'::timestamptz,5,true
where not exists (select 1 from public.sources where url='https://pip.worldbank.org/about');

with s as (select id from public.sources where url='https://pip.worldbank.org/about' limit 1),
c as (
 insert into public.claims(statement,status,confidence)
 select 'برآوردهای فقر و نابرابری بانک جهانی بر پایه داده‌های پیمایش‌های خانوار و داده‌های مرتبط تولید می‌شوند و نسخه داده‌ای آن در سپتامبر ۲۰۲۶ به‌روزرسانی شده است.','supported',0.96
 where not exists (select 1 from public.claims where statement like 'برآوردهای فقر و نابرابری بانک جهانی%') returning id
)
insert into public.evidence(claim_id,source_id,relation,excerpt,strength)
select c.id,s.id,'supports','صفحه رسمی PIP توضیح می‌دهد که برآوردها بر پایه داده‌های پیمایش خانوار و منابع داده مرتبط تهیه می‌شوند و نسخه 20260922_2021 در سپتامبر ۲۰۲۶ در دسترس است.',0.98
from c cross join s on conflict do nothing;

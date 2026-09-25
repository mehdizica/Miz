# MIZ — میز

پلتفرم داده‌محور برای شناسایی و اولویت‌بندی نیازهای مردم و ثبت، تحلیل و اعتبارسنجی ادعاها و شواهد.

## وضعیت فعلی
- MVP رابط RTL آماده است.
- داشبورد اکنون در صورت وجود متغیرهای محیطی، داده‌های عمومی `needs`، `claims`، `sources` و شمارش `profiles` را مستقیماً از Supabase می‌خواند.
- در نبود تنظیمات Supabase، رابط به‌صورت امن با داده نمایشی اجرا می‌شود.
- Schema اولیه شامل نیازها، ادعاها، منابع، شواهد، راستی‌آزمایی، اعتبار، گزارش، بازبینی، اعلان و Audit Log است.

## Stack
- Next.js 14 + TypeScript
- Tailwind CSS
- Supabase PostgreSQL + RLS
- GitHub: mehdizica/Miz
- Deployment target: Vercel

## Supabase
Project ref: `dlzgkizuppcdzhvgmoie`
Region: `eu-central-1`

## Environment
در محیط اجرا تنظیم شود:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

کلید `service_role` یا secret نباید در فرانت‌اند قرار گیرد.

## مسیر بعدی توسعه
1. اتصال احراز هویت و پروفایل.
2. ثبت واقعی نیاز و ادعا.
3. Evidence/Source workflow.
4. موتور امتیاز اعتبار ادعا با تفکیک «اطمینان» از «حقیقت قطعی».
5. Reputation Engine و Audit کامل.
6. داشبورد بررسی انسانی و ضدتقلب.
7. اتصال GitHub به Vercel و تنظیم Environment Variables.

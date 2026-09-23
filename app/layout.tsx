import "./globals.css";

export const metadata = {
  title: "MIZ — میز",
  description: "سامانه شناسایی، تحلیل و اعتبارسنجی نیازها و ادعاها",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}

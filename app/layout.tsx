import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Шакализатор сайтов",
  description: "Локальный MVP прокси-деградатора сайтов в духе Web 1.0",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

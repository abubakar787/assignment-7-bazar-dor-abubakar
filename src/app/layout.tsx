 
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "বাজার দর | প্রতিদিনের বাজারের দাম",
  description:
    "চাল, ডাল, তেল, সবজি, মাছ ও মাংসের বাজারদর এক নজরে দেখুন।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>
  {children}
  <Toaster position="top-right" richColors closeButton />
</body>
    </html>
  );
}

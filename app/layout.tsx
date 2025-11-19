import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { ClientLayout } from "@/components/layout/client-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Түмэн-Дугуй - Tire Shop",
  description: "Онлайн дугуй худалдааны програм",
  keywords: [
    "дугуй",
    "төмөр дугуй",
    "тээврийн хэрэгсэл",
    "онлайн худалдаа",
    "Tire Shop",
    "car tires",
    "truck tires",
    "motorcycle tires",
    "bicycle tires",
    "off-road tires",
    "rim",
    "wheel",
    "auto parts",
    "auto accessories",
    "tire repair",
    "авто дугуй",
    "авто сэлбэг",
    "сэлбэг хэрэгсэл",
    "авто засвар",
    "авто үйлчилгээ",
    "тээврийн хэрэгсэл худалдаа",
    "online tire shop",
    "buy tires online",
    "tire delivery",
    "tire replacement",
    "шингэн дугуй",
    "пневматик дугуй",
    "all-season tires",
    "winter tires",
    "summer tires",
    "авто сэлбэгийн дэлгүүр",
    "тээврийн дугуй",
    "дугуй",
    "Дугуйн худалдаа",
    "Дугуй зарна",
    "Дугуй захиалга",
    "Дугуй авна",
    "Дугуй солих",
    "автомашин дугуй",
    "мото дугуй",
    "оролдлого дугуй",
    "wheel alignment",
    "tire balancing",
    "tire rotation",
    "tire maintenance",
    "tire service",
    "road safety",
    "авто засвар үйлчилгээ",
    "авто засварын газар",
    "vehicle tires",
    "truck wheels",
    "bicycle wheels",
    "off-road wheels",
    "online auto shop",
    "авто худалдаа онлайн",
    "авто бүтээгдэхүүн",
  ],
  authors: [{ name: "Түмэн-Дугуй", url: "https://www.tumendugui.autos" }],
  creator: "Түмэн-Дугуй",
  publisher: "Түмэн-Дугуй",
  metadataBase: new URL("https://www.tumendugui.autos"),
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1f2937" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <ClientLayout>{children}</ClientLayout>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

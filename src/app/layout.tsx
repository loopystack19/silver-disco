import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UmojaHub - Connecting Africa's Learners, Workers, and Farmers",
  description:
    "An integrated platform addressing hunger, unemployment, and lack of education across Africa. Empowering communities through education, employment, and food security.",
  keywords: [
    "Africa",
    "education",
    "employment",
    "agriculture",
    "food security",
    "Kenya",
    "jobs",
    "farming",
    "marketplace",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

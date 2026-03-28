import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Mini Sonhos - Surpresas Personalizadas",
  description: "Fabricamos surpresas personalizadas para alegrar seu dia! Escolha seu scoop de micangas e descubra suas surpresas!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      className={`${poppins.variable} h-full antialiased !scroll-smooth scrollbar-thin scrollbar-thumb-pink-600 scrollbar-track-pink-600 scrollbar-thumb-pink-700 scrollbar-track-pink-900`}
    >
      <body className="min-h-full flex flex-col ">{children}</body>
      
    </html>
  );
}

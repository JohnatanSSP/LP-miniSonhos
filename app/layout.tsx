import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import FairyDustCursor from "./components/fairydust/fairydust";

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
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <FairyDustCursor />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono, Fredoka } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import "leaflet/dist/leaflet.css"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fredoka = Fredoka({ 
  subsets: ["latin"],
  weight: ["300","400","500","600","700"],
});

export const metadata: Metadata = {
  title: "PetSocity",
  description: "Tienda de mascotas",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${fredoka.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar/>
        {children}
        <Footer />
      </body>
    </html>
  );
}

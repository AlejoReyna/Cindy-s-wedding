import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cindy & Jorge ",
  description: "Celebra con nosotros nuestra boda el 22 de Agosto",
  appleWebApp: {
    capable: true,
    // Remover statusBarStyle para permitir control dinámico
  },
  icons: {
    icon: "/Diseño sin título.png",
    apple: "/Diseño sin título.png",
    shortcut: "/Diseño sin título.png",
  },
  openGraph: {
    images: ["/Diseño sin título.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/Diseño sin título.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

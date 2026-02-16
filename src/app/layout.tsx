import type { Metadata, Viewport } from "next";
import "./globals.css";

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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

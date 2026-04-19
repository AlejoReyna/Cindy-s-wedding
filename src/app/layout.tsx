import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BASE_PATH } from "@/lib/basePath";

export const metadata: Metadata = {
  metadataBase: new URL("https://alexreyna.github.io"),
  title: "Cindy & Jorge ",
  description: "Celebra con nosotros nuestra boda el 22 de Agosto",
  appleWebApp: {
    capable: true,
    // Remover statusBarStyle para permitir control dinámico
  },
  icons: {
    icon: `${BASE_PATH}/Diseño sin título.png`,
    apple: `${BASE_PATH}/Diseño sin título.png`,
    shortcut: `${BASE_PATH}/Diseño sin título.png`,
  },
  openGraph: {
    images: [`${BASE_PATH}/Diseño sin título.png`],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${BASE_PATH}/Diseño sin título.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#e8dfd2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div id="safari-tint-bar" aria-hidden="true" className="safari-tint-bar" />
        {children}
      </body>
    </html>
  );
}

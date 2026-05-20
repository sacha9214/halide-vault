import type { Metadata } from "next";
import { Geist, Geist_Mono, Syncopate } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { PriceProvider } from "@/lib/price-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syncopate = Syncopate({
  variable: "--font-syncopate",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Halide — Silver Sulphide",
  description: "Topographical light and surface tension",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syncopate.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <PriceProvider>{children}</PriceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

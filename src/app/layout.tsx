import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

import { Jomolhari, Kanit } from 'next/font/google'
import SessionWrapper from "@/components/SessionWrapper";
import CustomerProvider from "@/contexts/CustomerContext";

const Jomol = Jomolhari({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-logo"
})

const KanitFont = Kanit({
  subsets: ["latin"],
  weight: ["400"],
  style: "normal",
  display: "swap",
  variable: "--font-main"
})

export const metadata: Metadata = {
  title: "Toy Universe",
  description: "Toy Shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en" className={`${Jomol.variable} ${KanitFont.variable}`}>
      <SessionWrapper>
          <body>
            <Navbar />
            <main>
              <CustomerProvider>
                {children}
              </CustomerProvider>
            </main>
            <Footer />
          </body>
      </SessionWrapper>
    </html>
  );
}

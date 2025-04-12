import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";
import { ChatProvider } from "@/context/DappChat.context";
import { Providers } from "@/components/Providers";
import TestnetBanner from "@/components/ui/TestnetBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "OpenChat | Testnet-Only Decentralized Messaging",
  description: "A decentralized messaging platform that only works with testnet networks for your safety",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-cyber-black min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Providers>
            <ChatProvider>
              <div className="relative min-h-screen flex flex-col">
                {/* Cyber Grid Background */}
                <div className="fixed inset-0 bg-cyber-grid bg-[size:30px_30px] opacity-10 z-0 pointer-events-none"></div>
                
                {/* Glowing Orbs */}
                <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-cyber-glow opacity-20 blur-3xl rounded-full z-0 pointer-events-none"></div>
                <div className="fixed bottom-1/3 right-1/4 w-64 h-64 bg-cyber-glow opacity-20 blur-3xl rounded-full z-0 pointer-events-none"></div>
                
                <Navbar />
                <TestnetBanner />
                
                <main className="relative z-10 flex-grow">
                  {children}
                </main>
                
                <Footer />
              </div>
            </ChatProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

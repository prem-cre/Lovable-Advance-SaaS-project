import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/MainSidebar";
import { ClerkProvider } from "@clerk/nextjs";

import { ThemeProvider } from "@/components/theme-provider";
import { DarkGlossyParticleDrift } from "@/components/dark-glossy-particle-drift";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lovable SaaS",
  description: "A premium SaaS application built with Next.js and Shadcn UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} antialiased font-sans min-h-screen bg-background overflow-hidden h-dvh overscroll-none`}
        >
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              <SidebarProvider>
                <MainSidebar />
                <SidebarInset className="overflow-hidden relative">
                  <DarkGlossyParticleDrift />
                  {children}
                </SidebarInset>
              </SidebarProvider>
              <Toaster />
            </ThemeProvider>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

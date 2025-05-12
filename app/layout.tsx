import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { BrainCog } from "lucide-react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="antialiased min-h-svh flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex flex-col bg-background">
            <div className="flex-1 w-full flex flex-col items-center">
              <nav className="w-full flex justify-center h-16">
                <div className="w-full max-w-6xl flex justify-between items-center p-3 px-5">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link
                      href="/"
                      className="flex items-center gap-1 font-semibold text-lg text-stone-800"
                    >
                      <BrainCog size={24} />
                      Eva
                    </Link>
                  </div>
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </div>
              </nav>
              <div className="flex flex-col max-w-7xl min-h-screen">
                {children}
              </div>
              <nav className="w-full flex justify-center h-20 border-t">
                <div className="w-full max-w-6xl flex justify-between items-center p-3 px-5">
                  <p className="text-xs text-muted-foreground">
                    © 2025 Online Exam Platform. All rights reserved.
                  </p>
                  <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link
                      href="#"
                      className="text-xs hover:underline underline-offset-4"
                    >
                      Terms of Service
                    </Link>
                    <Link
                      href="#"
                      className="text-xs hover:underline underline-offset-4"
                    >
                      Privacy
                    </Link>
                  </nav>
                </div>
              </nav>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

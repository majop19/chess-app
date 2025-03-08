import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SiteConfig } from "@/lib/site-config";
import { Providers } from "./Provider";
import { TailwindIndicator } from "@/components/TailwindIndicator";
import { SideBar } from "@/layout/side-bar";
import { getAuthSession } from "@/lib/auth";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SiteConfig.title,
  description: SiteConfig.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAuthSession();

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={cn(
          dmSans.variable,
          "h-full bg-background font-sans antialiased"
        )}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <SideBar user={session?.user} />
            <div className="flex-1">{children}</div>
          </div>
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  );
}

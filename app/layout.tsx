import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SiteConfig } from "@/lib/site-config";
import { Providers } from "./Provider";
import { TailwindIndicator } from "@/components/TailwindIndicator";
import { SideBar } from "@/layout/side-bar";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  let imageUser = null;

  if (session?.user.image) {
    imageUser = await prisma.image.findUnique({
      where: {
        id: session?.user.image,
        userId: session?.user.id,
      },
      select: {
        url: true,
      },
    });
  }

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
            <SideBar
              user={
                session?.user
                  ? {
                      ...session?.user,
                      image: imageUser?.url ?? session?.user.image,
                    }
                  : undefined
              }
            />
            <div className="flex-1 min-h-screen min-w-screen">{children}</div>
          </div>
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  );
}

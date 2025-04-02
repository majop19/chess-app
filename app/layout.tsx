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

  const image = await prisma.user.findFirst({
    where: {
      id: session?.user.id,
    },
    select: {
      imageCloudinary: {
        select: {
          url: true,
        },
      },
    },
  });

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={cn(
          dmSans.variable,
          "h-full bg-background font-sans antialiased"
        )}
      >
        <Providers>
          <div className="relative flex min-h-screen min-w-screen flex-col justify-center">
            <SideBar
              user={
                session?.user
                  ? {
                      ...session?.user,
                      image: image?.imageCloudinary?.url ?? session?.user.image,
                    }
                  : undefined
              }
            />
            <div className="flex w-full justify-center">{children}</div>
          </div>
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  );
}

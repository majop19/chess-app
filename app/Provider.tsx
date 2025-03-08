"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";
import { Toaster } from "sonner";

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SidebarProvider defaultOpen={false}>
          <Toaster />
          <SessionProvider>{children}</SessionProvider>
        </SidebarProvider>
      </ThemeProvider>
    </>
  );
};

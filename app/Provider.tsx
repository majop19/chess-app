"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <Toaster richColors />
            <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>
          </QueryClientProvider>
        </SessionProvider>
      </ThemeProvider>
    </>
  );
};

"use client";

import type { ReactNode } from "react";

import { AuthProvider } from "@/contexts/AuthContext";
import { AppThemeProvider } from "@/contexts/ThemeContext";
import { AppToaster } from "@/components/ui/toast";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AppThemeProvider>
      <AuthProvider>
        {children}
        <AppToaster />
      </AuthProvider>
    </AppThemeProvider>
  );
}

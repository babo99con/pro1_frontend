"use client";

import * as React from "react";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";

import AppShell from "@/widgets/app-shell/ui/AppShell";
import { store } from "@/shared/store/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CssBaseline />
      <AppShell>{children}</AppShell>
    </Provider>
  );
}

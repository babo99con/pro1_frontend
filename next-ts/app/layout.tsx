"use client";

import * as React from "react";
import { CssBaseline} from "@mui/material";

import createCache from "@emotion/cache";
import { Provider } from "react-redux";

import AppShell from "../widgets/app-shell/ui/AppShell";
import { store } from "@/shared/store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Provider store={store}>
          <CssBaseline />
              <AppShell>{children}</AppShell>
          </Provider>
        
      </body>
    </html>
  );
}

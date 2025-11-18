"use client";

import * as React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { Provider } from "react-redux";
import theme from "./theme";
import AppShell from "./components/layout/AppShell";
import { store } from "./store";

const clientSideEmotionCache = createCache({ key: "css", prepend: true });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <CacheProvider value={clientSideEmotionCache}>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AppShell>{children}</AppShell>
            </ThemeProvider>
          </Provider>
        </CacheProvider>
      </body>
    </html>
  );
}

"use client";

import { createTheme } from "@mui/material/styles";

// 기본 MUI 테마 확장
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2", // 파란색 계열 기본값
    },
    secondary: {
      main: "#9c27b0", // 보라색 계열
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: `'Pretendard', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // 버튼 글자 대문자 방지
        },
      },
    },
  },
});

export default theme;

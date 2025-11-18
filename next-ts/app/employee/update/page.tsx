"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

export default function EmployeeUpdatePage() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={700}>
        직원 수정
      </Typography>
      <Typography color="text.secondary">
        수정 기능은 목록에서 직원 선택 후 진행하도록 추후 구현 예정입니다.
      </Typography>
    </Box>
  );
}

"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

export default function EmployeeDeletePage() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={700}>
        직원 삭제
      </Typography>
      <Typography color="text.secondary">
        삭제 기능은 목록/상세에서 제공하도록 추후 구현 예정입니다.
      </Typography>
    </Box>
  );
}

"use client";

import React, { useEffect } from "react";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Alert, CircularProgress, Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCommentsRequested } from "../store/features/comments/commentsSlice";

const CommentsPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.comments);

  useEffect(() => {
    dispatch(fetchCommentsRequested());
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={2}>
        Comments
      </Typography>

      {loading && (
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <CircularProgress size={20} />
          <Typography>불러오는 중...</Typography>
        </Stack>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>작성자</TableCell>
            <TableCell>이메일</TableCell>
            <TableCell>내용</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((comment) => (
            <TableRow key={comment.id} hover>
              <TableCell>{comment.id}</TableCell>
              <TableCell>{comment.name}</TableCell>
              <TableCell>{comment.email}</TableCell>
              <TableCell>{comment.body.slice(0, 40)}...</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default CommentsPage;

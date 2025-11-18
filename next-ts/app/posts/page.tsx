"use client";

import React, { useEffect } from "react";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Alert, CircularProgress, Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchPostsRequested } from "../store/features/posts/postsSlice";

const PostsPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPostsRequested());
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={2}>
        Posts
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
            <TableCell>제목</TableCell>
            <TableCell>작성자</TableCell>
            <TableCell>내용</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((post) => (
            <TableRow key={post.id} hover>
              <TableCell>{post.id}</TableCell>
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.userId}</TableCell>
              <TableCell>{post.body.slice(0, 40)}...</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default PostsPage;

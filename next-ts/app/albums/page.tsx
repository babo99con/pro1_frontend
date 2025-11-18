"use client";

import React, { useEffect } from "react";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Alert, CircularProgress, Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchAlbumsRequested } from "../store/features/albums/albumsSlice";

const AlbumsPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.albums);

  useEffect(() => {
    dispatch(fetchAlbumsRequested());
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={2}>
        Albums
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
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((album) => (
            <TableRow key={album.id} hover>
              <TableCell>{album.id}</TableCell>
              <TableCell>{album.title}</TableCell>
              <TableCell>{album.userId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default AlbumsPage;

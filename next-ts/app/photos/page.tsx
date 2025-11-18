"use client";

import React, { useEffect } from "react";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Alert, CircularProgress, Stack, Avatar } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchPhotosRequested } from "../store/features/photos/photosSlice";

const PhotosPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.photos);

  useEffect(() => {
    dispatch(fetchPhotosRequested());
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={2}>
        Photos
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
            <TableCell>썸네일</TableCell>
            <TableCell>제목</TableCell>
            <TableCell>앨범</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.slice(0, 50).map((photo) => (
            <TableRow key={photo.id} hover>
              <TableCell>{photo.id}</TableCell>
              <TableCell>
                <Avatar src={photo.thumbnailUrl} alt={photo.title} variant="rounded" sx={{ width: 48, height: 48 }} />
              </TableCell>
              <TableCell>{photo.title}</TableCell>
              <TableCell>{photo.albumId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default PhotosPage;

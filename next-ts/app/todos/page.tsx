"use client";

import React, { useEffect } from "react";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Alert, CircularProgress, Stack, Chip } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTodosRequested } from "../store/features/todos/todosSlice";

const TodosPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.todos);

  useEffect(() => {
    dispatch(fetchTodosRequested());
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={2}>
        Todos
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
            <TableCell>사용자</TableCell>
            <TableCell>상태</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((todo) => (
            <TableRow key={todo.id} hover>
              <TableCell>{todo.id}</TableCell>
              <TableCell>{todo.title}</TableCell>
              <TableCell>{todo.userId}</TableCell>
              <TableCell>
                <Chip
                  label={todo.completed ? "완료" : "진행중"}
                  color={todo.completed ? "success" : "default"}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default TodosPage;

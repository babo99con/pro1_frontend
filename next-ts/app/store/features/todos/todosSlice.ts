"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface TodosState {
  items: Todo[];
  loading: boolean;
  error?: string;
}

const initialState: TodosState = {
  items: [],
  loading: false,
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    fetchTodosRequested(state) {
      state.loading = true;
      state.error = undefined;
    },
    fetchTodosSucceeded(state, action: PayloadAction<Todo[]>) {
      state.loading = false;
      state.items = action.payload;
    },
    fetchTodosFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchTodosRequested, fetchTodosSucceeded, fetchTodosFailed } =
  todosSlice.actions;

export default todosSlice.reducer;

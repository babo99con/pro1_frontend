"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface PostsState {
  items: Post[];
  loading: boolean;
  error?: string;
}

const initialState: PostsState = {
  items: [],
  loading: false,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    fetchPostsRequested(state) {
      state.loading = true;
      state.error = undefined;
    },
    fetchPostsSucceeded(state, action: PayloadAction<Post[]>) {
      state.loading = false;
      state.items = action.payload;
    },
    fetchPostsFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchPostsRequested, fetchPostsSucceeded, fetchPostsFailed } =
  postsSlice.actions;

export default postsSlice.reducer;

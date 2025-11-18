"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CommentItem {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

interface CommentsState {
  items: CommentItem[];
  loading: boolean;
  error?: string;
}

const initialState: CommentsState = {
  items: [],
  loading: false,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    fetchCommentsRequested(state) {
      state.loading = true;
      state.error = undefined;
    },
    fetchCommentsSucceeded(state, action: PayloadAction<CommentItem[]>) {
      state.loading = false;
      state.items = action.payload;
    },
    fetchCommentsFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCommentsRequested,
  fetchCommentsSucceeded,
  fetchCommentsFailed,
} = commentsSlice.actions;

export default commentsSlice.reducer;

"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Album {
  userId: number;
  id: number;
  title: string;
}

interface AlbumsState {
  items: Album[];
  loading: boolean;
  error?: string;
}

const initialState: AlbumsState = {
  items: [],
  loading: false,
};

const albumsSlice = createSlice({
  name: "albums",
  initialState,
  reducers: {
    fetchAlbumsRequested(state) {
      state.loading = true;
      state.error = undefined;
    },
    fetchAlbumsSucceeded(state, action: PayloadAction<Album[]>) {
      state.loading = false;
      state.items = action.payload;
    },
    fetchAlbumsFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAlbumsRequested,
  fetchAlbumsSucceeded,
  fetchAlbumsFailed,
} = albumsSlice.actions;

export default albumsSlice.reducer;

"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

interface PhotosState {
  items: Photo[];
  loading: boolean;
  error?: string;
}

const initialState: PhotosState = {
  items: [],
  loading: false,
};

const photosSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    fetchPhotosRequested(state) {
      state.loading = true;
      state.error = undefined;
    },
    fetchPhotosSucceeded(state, action: PayloadAction<Photo[]>) {
      state.loading = false;
      state.items = action.payload;
    },
    fetchPhotosFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchPhotosRequested,
  fetchPhotosSucceeded,
  fetchPhotosFailed,
} = photosSlice.actions;

export default photosSlice.reducer;

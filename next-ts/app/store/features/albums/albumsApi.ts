"use client";

import axios from "axios";
import type { Album } from "./albumsSlice";

export const fetchAlbumsApi = async (): Promise<Album[]> => {
  const res = await axios.get<Album[]>("https://jsonplaceholder.typicode.com/albums");
  return res.data;
};

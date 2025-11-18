"use client";

import axios from "axios";
import type { Photo } from "./photosSlice";

export const fetchPhotosApi = async (): Promise<Photo[]> => {
  const res = await axios.get<Photo[]>("https://jsonplaceholder.typicode.com/photos");
  return res.data;
};

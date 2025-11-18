"use client";

import axios from "axios";
import type { Post } from "./postsSlice";

export const fetchPostsApi = async (): Promise<Post[]> => {
  const res = await axios.get<Post[]>("https://jsonplaceholder.typicode.com/posts");
  return res.data;
};

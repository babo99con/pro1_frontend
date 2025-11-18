"use client";

import axios from "axios";
import type { CommentItem } from "./commentsSlice";

export const fetchCommentsApi = async (): Promise<CommentItem[]> => {
  const res = await axios.get<CommentItem[]>("https://jsonplaceholder.typicode.com/comments");
  return res.data;
};

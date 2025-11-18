"use client";

import axios from "axios";
import type { Todo } from "./todosSlice";

export const fetchTodosApi = async (): Promise<Todo[]> => {
  const res = await axios.get<Todo[]>("https://jsonplaceholder.typicode.com/todos");
  return res.data;
};

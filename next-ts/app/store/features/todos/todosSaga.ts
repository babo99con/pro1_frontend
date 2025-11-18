"use client";

import { call, put, takeLatest } from "redux-saga/effects";
import { fetchTodosApi } from "./todosApi";
import {
  fetchTodosFailed,
  fetchTodosRequested,
  fetchTodosSucceeded,
  Todo,
} from "./todosSlice";

function* fetchTodosWorker() {
  try {
    const todos: Todo[] = yield call(fetchTodosApi);
    yield put(fetchTodosSucceeded(todos));
  } catch (err: any) {
    yield put(fetchTodosFailed(err?.message ?? "할 일 목록을 불러오지 못했습니다."));
  }
}

export function* todosSaga() {
  yield takeLatest(fetchTodosRequested.type, fetchTodosWorker);
}

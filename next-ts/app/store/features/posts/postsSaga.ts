"use client";

import { call, put, takeLatest } from "redux-saga/effects";
import { fetchPostsApi } from "./postsApi";
import {
  fetchPostsFailed,
  fetchPostsRequested,
  fetchPostsSucceeded,
  Post,
} from "./postsSlice";

function* fetchPostsWorker() {
  try {
    const posts: Post[] = yield call(fetchPostsApi);
    yield put(fetchPostsSucceeded(posts));
  } catch (err: any) {
    yield put(fetchPostsFailed(err?.message ?? "포스트를 불러오지 못했습니다."));
  }
}

export function* postsSaga() {
  yield takeLatest(fetchPostsRequested.type, fetchPostsWorker);
}

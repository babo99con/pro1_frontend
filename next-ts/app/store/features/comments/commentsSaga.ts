"use client";

import { call, put, takeLatest } from "redux-saga/effects";
import { fetchCommentsApi } from "./commentsApi";
import {
  fetchCommentsFailed,
  fetchCommentsRequested,
  fetchCommentsSucceeded,
  CommentItem,
} from "./commentsSlice";

function* fetchCommentsWorker() {
  try {
    const comments: CommentItem[] = yield call(fetchCommentsApi);
    yield put(fetchCommentsSucceeded(comments));
  } catch (err: any) {
    yield put(fetchCommentsFailed(err?.message ?? "댓글을 불러오지 못했습니다."));
  }
}

export function* commentsSaga() {
  yield takeLatest(fetchCommentsRequested.type, fetchCommentsWorker);
}

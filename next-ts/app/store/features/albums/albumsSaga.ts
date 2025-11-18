"use client";

import { call, put, takeLatest } from "redux-saga/effects";
import { fetchAlbumsApi } from "./albumsApi";
import {
  fetchAlbumsFailed,
  fetchAlbumsRequested,
  fetchAlbumsSucceeded,
  Album,
} from "./albumsSlice";

function* fetchAlbumsWorker() {
  try {
    const albums: Album[] = yield call(fetchAlbumsApi);
    yield put(fetchAlbumsSucceeded(albums));
  } catch (err: any) {
    yield put(fetchAlbumsFailed(err?.message ?? "앨범을 불러오지 못했습니다."));
  }
}

export function* albumsSaga() {
  yield takeLatest(fetchAlbumsRequested.type, fetchAlbumsWorker);
}

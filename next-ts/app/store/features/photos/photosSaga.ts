"use client";

import { call, put, takeLatest } from "redux-saga/effects";
import { fetchPhotosApi } from "./photosApi";
import {
  fetchPhotosFailed,
  fetchPhotosRequested,
  fetchPhotosSucceeded,
  Photo,
} from "./photosSlice";

function* fetchPhotosWorker() {
  try {
    const photos: Photo[] = yield call(fetchPhotosApi);
    yield put(fetchPhotosSucceeded(photos));
  } catch (err: any) {
    yield put(fetchPhotosFailed(err?.message ?? "사진을 불러오지 못했습니다."));
  }
}

export function* photosSaga() {
  yield takeLatest(fetchPhotosRequested.type, fetchPhotosWorker);
}

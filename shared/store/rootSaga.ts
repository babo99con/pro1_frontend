"use client";

import { all, fork } from "redux-saga/effects";
import { employeesSaga } from "@/entities/employee/model/employeesSaga";

export default function* rootSaga() {
  yield all([fork(employeesSaga)]);
}

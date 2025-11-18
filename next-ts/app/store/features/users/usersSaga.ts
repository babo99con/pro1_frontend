"use client";

import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  createEmployeeApi,
  deleteEmployeeApi,
  fetchEmployeesApi,
  updateEmployeeApi,
} from "./usersApi";
import {
  createEmployeeFailed,
  createEmployeeRequested,
  createEmployeeSucceeded,
  deleteEmployeeFailed,
  deleteEmployeeRequested,
  deleteEmployeeSucceeded,
  fetchEmployeesFailed,
  fetchEmployeesRequested,
  fetchEmployeesSucceeded,
  Employee,
  EmployeeInput,
  updateEmployeeFailed,
  updateEmployeeRequested,
  updateEmployeeSucceeded,
} from "./usersSlice";

function* fetchEmployeesWorker() {
  try {
    const employees: Employee[] = yield call(fetchEmployeesApi);
    yield put(fetchEmployeesSucceeded(employees));
  } catch (err: any) {
    yield put(fetchEmployeesFailed(err?.message ?? "Failed to load employees"));
  }
}

function* createEmployeeWorker(action: PayloadAction<EmployeeInput>) {
  try {
    const created: Employee = yield call(createEmployeeApi, action.payload);
    yield put(createEmployeeSucceeded(created));
  } catch (err: any) {
    yield put(createEmployeeFailed(err?.message ?? "Failed to create employee"));
  }
}

function* updateEmployeeWorker(
  action: PayloadAction<{ id: number; data: Partial<EmployeeInput> }>
) {
  try {
    const updated: Employee = yield call(
      updateEmployeeApi,
      action.payload.id,
      action.payload.data
    );
    yield put(updateEmployeeSucceeded(updated));
  } catch (err: any) {
    yield put(updateEmployeeFailed(err?.message ?? "Failed to update employee"));
  }
}

function* deleteEmployeeWorker(action: PayloadAction<number>) {
  try {
    yield call(deleteEmployeeApi, action.payload);
    yield put(deleteEmployeeSucceeded(action.payload));
  } catch (err: any) {
    yield put(deleteEmployeeFailed(err?.message ?? "Failed to delete employee"));
  }
}

export function* usersSaga() {
  yield takeLatest(fetchEmployeesRequested.type, fetchEmployeesWorker);
  yield takeLatest(createEmployeeRequested.type, createEmployeeWorker);
  yield takeLatest(updateEmployeeRequested.type, updateEmployeeWorker);
  yield takeLatest(deleteEmployeeRequested.type, deleteEmployeeWorker);
}

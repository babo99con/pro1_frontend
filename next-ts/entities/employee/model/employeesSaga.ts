"use client";

import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  createEmployeeApi,
  deleteEmployeeApi,
  fetchEmployeesApi,
  updateEmployeeApi,
} from "../api/employeesApi";
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
} from "./employeesSlice";

const getErrorMessage = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback;

function* fetchEmployeesWorker() {
  try {
    const employees: Employee[] = yield call(fetchEmployeesApi);
    yield put(fetchEmployeesSucceeded(employees));
  } catch (err: unknown) {
    yield put(fetchEmployeesFailed(getErrorMessage(err, "Failed to load employees")));
  }
}

function* createEmployeeWorker(action: PayloadAction<EmployeeInput>) {
  try {
    const created: Employee = yield call(createEmployeeApi, action.payload);
    yield put(createEmployeeSucceeded(created));
  } catch (err: unknown) {
    yield put(createEmployeeFailed(getErrorMessage(err, "Failed to create employee")));
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
  } catch (err: unknown) {
    yield put(updateEmployeeFailed(getErrorMessage(err, "Failed to update employee")));
  }
}

function* deleteEmployeeWorker(action: PayloadAction<number>) {
  try {
    yield call(deleteEmployeeApi, action.payload);
    yield put(deleteEmployeeSucceeded(action.payload));
  } catch (err: unknown) {
    yield put(deleteEmployeeFailed(getErrorMessage(err, "Failed to delete employee")));
  }
}

export function* employeesSaga() {
  yield takeLatest(fetchEmployeesRequested.type, fetchEmployeesWorker);
  yield takeLatest(createEmployeeRequested.type, createEmployeeWorker);
  yield takeLatest(updateEmployeeRequested.type, updateEmployeeWorker);
  yield takeLatest(deleteEmployeeRequested.type, deleteEmployeeWorker);
}

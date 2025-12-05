"use client";

import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  createEmployeeApi,
  deleteEmployeeApi,
  fetchEmployeesApi,
  updateEmployeeApi,
  fetchEmployeesbyConditionApi,
} from "../api/employeesApi";

import {
  fetchEmployeesRequest,
  fetchEmployeesSuccess,
  fetchEmployeesFailure,

  createEmployeeRequest,
  createEmployeeSuccess,
  createEmployeeFailure,

  updateEmployeeRequest,
  updateEmployeeSuccess,
  updateEmployeeFailure,

  deleteEmployeeRequest,
  deleteEmployeeSuccess,
  deleteEmployeeFailure,

  fetchEmployeesByConditionRequest, 
  fetchEmployeesByConditionSuccess,
  fetchEmployeesByConditionFailure,

  type Employee,
  type EmployeeInput,
} from "./employeesSlice";

const getErrorMessage = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback;

function* fetchEmployeesWorker() {
  try {
    const employees: Employee[] = yield call(fetchEmployeesApi);
    yield put(fetchEmployeesSuccess(employees));
  } catch (err: unknown) {
    yield put(
      fetchEmployeesFailure(
        getErrorMessage(err, "Failed to load employees")
      )
    );
  }
}

function* fetchEmployeesByConditionWorker(action: PayloadAction<EmployeeInput>) {
  try {
    // console.log(action.payload);
    const employees: Employee[] = yield call(fetchEmployeesbyConditionApi, action.payload);
    yield put(fetchEmployeesByConditionSuccess(employees));
  } catch (err: unknown) {
    yield put(
      fetchEmployeesByConditionFailure(
        getErrorMessage(err, "Failed to load employees")
      )
    );
  }
}



function* createEmployeeWorker(action: PayloadAction<EmployeeInput>) {
  try {
    const created: Employee = yield call(createEmployeeApi, action.payload);
    yield put(createEmployeeSuccess(created));
  } catch (err: unknown) {
    yield put(
      createEmployeeFailure(
        getErrorMessage(err, "Failed to create employee")
      )
    );
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
    yield put(updateEmployeeSuccess(updated));
  } catch (err: unknown) {
    yield put(
      updateEmployeeFailure(
        getErrorMessage(err, "Failed to update employee")
      )
    );
  }
}

function* deleteEmployeeWorker(action: PayloadAction<number>) {
  try {
    yield call(deleteEmployeeApi, action.payload);
    yield put(deleteEmployeeSuccess(action.payload));
  } catch (err: unknown) {
    yield put(
      deleteEmployeeFailure(
        getErrorMessage(err, "Failed to delete employee")
      )
    );
  }
}

export function* employeesSaga() {
  yield takeLatest(fetchEmployeesRequest.type, fetchEmployeesWorker);
  yield takeLatest(createEmployeeRequest.type, createEmployeeWorker);
  yield takeLatest(updateEmployeeRequest.type, updateEmployeeWorker);
  yield takeLatest(deleteEmployeeRequest.type, deleteEmployeeWorker);

  yield takeLatest(fetchEmployeesByConditionRequest.type, fetchEmployeesByConditionWorker);
  
}

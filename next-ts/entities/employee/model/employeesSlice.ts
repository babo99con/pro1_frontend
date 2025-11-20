"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Employee {
  id: number;
  employeeId: string;
  name: string;
  emailLocal?: string;
  emailDomain?: string;
  email?: string;
  department?: string;
  gender?: string;
  birthDate?: string;
  phonePrefix?: string;
  phoneMiddle?: string;
  phoneLast?: string;
  phone?: string;
  zipCode?: string;
  address1?: string;
  address2?: string;
  position?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type EmployeeInput = Omit<Employee, "id" | "createdAt" | "updatedAt">;

interface EmployeesState {
  items: Employee[];
  loading: boolean;
  error?: string;
}

const initialState: EmployeesState = {
  items: [],
  loading: false,
};

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    fetchEmployeesRequested(state) {
      state.loading = true;
      state.error = undefined;
    },
    fetchEmployeesSucceeded(state, action: PayloadAction<Employee[]>) {
      state.loading = false;
      state.items = action.payload;
    },
    fetchEmployeesFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createEmployeeRequested(state, _action: PayloadAction<EmployeeInput>) {
      void _action;
      state.loading = true;
      state.error = undefined;
    },
    createEmployeeSucceeded(state, action: PayloadAction<Employee>) {
      state.loading = false;
      state.items.push(action.payload);
    },
    createEmployeeFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateEmployeeRequested(
      state,
      _action: PayloadAction<{ id: number; data: Partial<Employee> }>
    ) {
      void _action;
      state.loading = true;
      state.error = undefined;
    },
    updateEmployeeSucceeded(state, action: PayloadAction<Employee>) {
      state.loading = false;
      state.items = state.items.map((emp) =>
        emp.id === action.payload.id ? action.payload : emp
      );
    },
    updateEmployeeFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteEmployeeRequested(state, _action: PayloadAction<number>) {
      void _action;
      state.loading = true;
      state.error = undefined;
    },
    deleteEmployeeSucceeded(state, action: PayloadAction<number>) {
      state.loading = false;
      state.items = state.items.filter((emp) => emp.id !== action.payload);
    },
    deleteEmployeeFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchEmployeesRequested,
  fetchEmployeesSucceeded,
  fetchEmployeesFailed,
  createEmployeeRequested,
  createEmployeeSucceeded,
  createEmployeeFailed,
  updateEmployeeRequested,
  updateEmployeeSucceeded,
  updateEmployeeFailed,
  deleteEmployeeRequested,
  deleteEmployeeSucceeded,
  deleteEmployeeFailed,
} = employeesSlice.actions;

export default employeesSlice.reducer;

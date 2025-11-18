"use client";

import axios from "axios";
import type { Employee, EmployeeInput } from "./usersSlice";

const BASE_URL =
  process.env.NEXT_PUBLIC_EMPLOYEE_API ?? "http://192.168.1.64:3001/api/employees";

export async function fetchEmployeesApi(): Promise<Employee[]> {
  const res = await axios.get<Employee[]>(BASE_URL);
  return res.data;
}

export async function createEmployeeApi(data: EmployeeInput): Promise<Employee> {
  const res = await axios.post<Employee>(BASE_URL, data);
  return res.data;
}

export async function updateEmployeeApi(
  id: number,
  data: Partial<EmployeeInput>
): Promise<Employee> {
  const res = await axios.put<Employee>(`${BASE_URL}/${id}`, data);
  return res.data;
}

export async function deleteEmployeeApi(id: number): Promise<void> {
  await axios.delete(`${BASE_URL}/${id}`);
}

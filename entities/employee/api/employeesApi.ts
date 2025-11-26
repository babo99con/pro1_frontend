"use client";

import axios from "axios";
import type { Employee, EmployeeInput } from "../model/employeesSlice";

const EMPLOYEE_API_BASE =
  process.env.NEXT_PUBLIC_EMPLOYEE_API ?? "http://192.168.1.64:3001/api/employees";

export async function fetchEmployeesApi(): Promise<Employee[]> {
  const res = await axios.get<Employee[]>(EMPLOYEE_API_BASE);
  return res.data;
}

export async function fetchEmployeeApi(id: number): Promise<Employee> {
  const res = await axios.get<Employee>(`${EMPLOYEE_API_BASE}/${id}`);
  return res.data;
}

export async function createEmployeeApi(data: EmployeeInput): Promise<Employee> {
  const res = await axios.post<Employee>(EMPLOYEE_API_BASE, data);
  return res.data;
}

export async function updateEmployeeApi(
  id: number,
  data: Partial<EmployeeInput>
): Promise<Employee> {
  const res = await axios.put<Employee>(`${EMPLOYEE_API_BASE}/${id}`, data);
  return res.data;
}

export async function deleteEmployeeApi(id: number): Promise<void> {
  await axios.delete(`${EMPLOYEE_API_BASE}/${id}`);
}

"use client";

import axios from "axios";
import type { Employee, EmployeeInput, SearchCondition } from "../model/employeesSlice";

const EMPLOYEE_API_BASE =
  process.env.NEXT_PUBLIC_EMPLOYEE_API ?? "http://192.168.1.64:3001/api/employees";

export async function fetchEmployeesApi(): Promise<Employee[]> {
  const res = await axios.get<Employee[]>(EMPLOYEE_API_BASE);
  return res.data;
}

/**
 * 🔥 [수정] 조건부 직원 목록 조회 API
 * - 파라미터 타입을 Redux에서 사용하는 `SearchCondition`으로 통일했습니다.
 * - `data.type` 대신 올바른 속성명인 `data.condition`을 사용하도록 수정했습니다.
 */
export async function fetchEmployeesbyConditionApi(
  data: SearchCondition
): Promise<Employee[]> {
  const { condition, value } = data;
  const url = `${EMPLOYEE_API_BASE}/search?condition=${condition}&value=${value}`;
  const res = await axios.get<Employee[]>(url);
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

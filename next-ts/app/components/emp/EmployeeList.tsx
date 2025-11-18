"use client";

import React from "react";
import Link from "next/link";
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

interface Employee {
  id: string;
  name: string;
  department: string;
  email: string;
  phone: string;
}

const EmployeeList = () => {
  const employees: Employee[] = [
    { id: "E001", name: "홍길동", department: "회계", email: "hong@naver.com", phone: "010-1234-5678" },
    { id: "E002", name: "김철수", department: "영업", email: "chul@daum.net", phone: "010-5678-1234" },
    { id: "E003", name: "이영희", department: "인사", email: "lee@kakao.com", phone: "010-4321-8765" },
    { id: "E004", name: "박민수", department: "IT", email: "park@gmail.com", phone: "010-2468-1357" },
    { id: "E005", name: "최지현", department: "마케팅", email: "choi@nate.com", phone: "010-9753-8642" },
  ];

  return (
    <Box maxWidth="800px" mx="auto" mt={5}>
      <Typography variant="h4" align="center" gutterBottom>
        직원 목록
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>직원 ID</TableCell>
            <TableCell>이름</TableCell>
            <TableCell>부서</TableCell>
            <TableCell>이메일</TableCell>
            <TableCell>전화번호</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((emp) => (
            <TableRow key={emp.id}>
              <TableCell>{emp.id}</TableCell>
              <TableCell>{emp.name}</TableCell>
              <TableCell>{emp.department}</TableCell>
              <TableCell>{emp.email}</TableCell>
              <TableCell>{emp.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box textAlign="right" mt={3}>
        <Link href="/feature/register">
          <Button variant="contained" color="primary">
            신규 등록
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default EmployeeList;

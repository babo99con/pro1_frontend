"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteEmployeeRequested,
  fetchEmployeesRequested,
  type Employee,
} from "@/entities/employee/model/employeesSlice";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";

const SEARCH_FIELDS = [
  { value: "name", label: "이름" },
  { value: "employeeId", label: "사번" },
  { value: "department", label: "부서" },
  { value: "address", label: "주소" },
  { value: "email", label: "이메일" },
] as const;

type SearchField = (typeof SEARCH_FIELDS)[number]["value"];
type SortField = "employeeId" | "name" | "department";
type SortDirection = "asc" | "desc";

const EmployeeListPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.employees);
  const [query, setQuery] = useState("");
  const [searchField, setSearchField] = useState<SearchField>("name");
  const [sort, setSort] = useState<{ field: SortField; direction: SortDirection }>(
    { field: "employeeId", direction: "asc" }
  );

  useEffect(() => {
    dispatch(fetchEmployeesRequested());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    const normalize = (value?: string | null) =>
      value ? value.toString().toLowerCase() : "";

    return items.filter((employee) => {
      const emailValue =
        employee.email ??
        (employee.emailLocal && employee.emailDomain
          ? `${employee.emailLocal}@${employee.emailDomain}`
          : "");
      const addressValue = [employee.address1, employee.address2]
        .filter(Boolean)
        .join(" ");

      const valueMap: Record<SearchField, string> = {
        name: normalize(employee.name),
        employeeId: normalize(employee.employeeId),
        department: normalize(employee.department),
        address: normalize(addressValue),
        email: normalize(emailValue),
      };

      return valueMap[searchField].includes(q);
    });
  }, [items, query, searchField]);

  const sorted = useMemo(() => {
    const sortable = [...filtered];
    const valueFor = (employee: Employee) => {
      if (sort.field === "employeeId") return employee.employeeId ?? "";
      if (sort.field === "name") return employee.name ?? "";
      return employee.department ?? "";
    };

    sortable.sort((a, b) => {
      const aVal = valueFor(a);
      const bVal = valueFor(b);
      const result = aVal.localeCompare(bVal, undefined, {
        numeric: true,
        sensitivity: "base",
      });
      return sort.direction === "asc" ? result : -result;
    });

    return sortable;
  }, [filtered, sort]);

  const handleSort = (field: SortField) => {
    setSort((prev) => {
      if (prev.field === field) {
        return { field, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { field, direction: "asc" };
    });
  };

  const handleSearchFieldChange = (event: SelectChangeEvent<string>) => {
    setSearchField(event.target.value as SearchField);
  };

  const currentLabel =
    SEARCH_FIELDS.find((opt) => opt.value === searchField)?.label ?? "검색";

  return (
    <Box maxWidth="1100px" mx="auto" mt={4}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            직원 목록
          </Typography>
          <Typography color="text.secondary">
            전체 직원 정보를 조회하고 관리할 수 있습니다.
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/employees/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          직원 등록
        </Button>
      </Stack>

      {loading && (
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <CircularProgress size={18} />
          <Typography color="text.secondary">데이터를 불러오는 중입니다…</Typography>
        </Stack>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", sm: "center" }}
        mb={2}
      >
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select value={searchField} onChange={handleSearchFieldChange}>
            {SEARCH_FIELDS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          size="small"
          placeholder={`${currentLabel} 검색`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sortDirection={sort.field === "employeeId" ? sort.direction : false}>
              <TableSortLabel
                active={sort.field === "employeeId"}
                direction={sort.field === "employeeId" ? sort.direction : "asc"}
                onClick={() => handleSort("employeeId")}
              >
                사번
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={sort.field === "name" ? sort.direction : false}>
              <TableSortLabel
                active={sort.field === "name"}
                direction={sort.field === "name" ? sort.direction : "asc"}
                onClick={() => handleSort("name")}
              >
                이름
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={sort.field === "department" ? sort.direction : false}>
              <TableSortLabel
                active={sort.field === "department"}
                direction={sort.field === "department" ? sort.direction : "asc"}
                onClick={() => handleSort("department")}
              >
                부서
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">상세</TableCell>
            <TableCell align="center">수정</TableCell>
            <TableCell align="center">삭제</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((employee) => (
            <TableRow key={employee.id} hover>
              <TableCell>{employee.employeeId ?? "-"}</TableCell>
              <TableCell>
                <Link
                  href={`/employees/${employee.id}`}
                  style={{
                    color: "#1976d2",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  {employee.name ?? "-"}
                </Link>
              </TableCell>
              <TableCell>{employee.department ?? "-"}</TableCell>
              <TableCell align="center">
                <IconButton
                  component={Link}
                  href={`/employees/${employee.id}`}
                  aria-label="상세 보기"
                  color="primary"
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </TableCell>
              <TableCell align="center">
                <IconButton
                  component={Link}
                  href={`/employees/${employee.id}`}
                  aria-label="수정하기"
                  color="primary"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </TableCell>
              <TableCell align="center">
                <IconButton
                  aria-label="삭제하기"
                  color="error"
                  onClick={() => {
                    if (!confirm("정말 삭제할까요?")) return;
                    dispatch(deleteEmployeeRequested(employee.id));
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default EmployeeListPage;

"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
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
  TextField,
  Typography,
  TableSortLabel,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  deleteEmployeeRequested,
  fetchEmployeesRequested,
} from "../../store/features/users/usersSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

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

const UserListPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.users);
  const [query, setQuery] = useState("");
  const [searchField, setSearchField] = useState<SearchField>(
    SEARCH_FIELDS[0].value
  );
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

    return items.filter((u) => {
      const emailValue =
        u.email ??
        (u.emailLocal && u.emailDomain
          ? `${u.emailLocal}@${u.emailDomain}`
          : "");
      const addressValue = [u.address1, u.address2].filter(Boolean).join(" ");

      const valueMap: Record<SearchField, string> = {
        name: normalize(u.name),
        employeeId: normalize(u.employeeId),
        department: normalize(u.department),
        address: normalize(addressValue),
        email: normalize(emailValue),
      };

      return valueMap[searchField].includes(q);
    });
  }, [items, query, searchField]);

  const handleFieldChange = (e: SelectChangeEvent<string>) => {
    setSearchField(e.target.value as SearchField);
  };

  const handleSort = (field: SortField) => {
    setSort((prev) => {
      if (prev.field === field) {
        return { field, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { field, direction: "asc" };
    });
  };

  const sorted = useMemo(() => {
    const sortable = [...filtered];
    const valueFor = (u: (typeof items)[number]) => {
      if (sort.field === "employeeId") return u.employeeId ?? "";
      if (sort.field === "name") return u.name ?? "";
      return u.department ?? "";
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
  }, [filtered, items, sort]);

  const currentLabel =
    SEARCH_FIELDS.find((opt) => opt.value === searchField)?.label ?? "검색";

  return (
    <Box maxWidth="1100px" mx="auto" mt={4}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          목록
        </Typography>
        <Link href="/employee/create">
          <IconButton
            aria-label="직원 등록"
            color="primary"
            sx={{ bgcolor: "primary.50", borderRadius: 2 }}
          >
            <AddIcon />
          </IconButton>
        </Link>
      </Stack>

      {loading && (
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <CircularProgress size={20} />
          <Typography>불러오는 중...</Typography>
        </Stack>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1.5}
        mb={2}
      >
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select value={searchField} onChange={handleFieldChange} displayEmpty>
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
          sx={{ minWidth: 320, maxWidth: 480 }}
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
            <TableCell align="center">자세히</TableCell>
            <TableCell align="center">수정</TableCell>
            <TableCell align="center">삭제</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((user) => (
            <TableRow key={user.id} hover>
              <TableCell>{user.employeeId ?? "-"}</TableCell>
              <TableCell>
                <Link
                  href={`/feature/detail/${user.id}`}
                  style={{
                    color: "#1976d2",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  {user.name ?? "-"}
                </Link>
              </TableCell>
              <TableCell>{user.department ?? "-"}</TableCell>
              <TableCell align="center">
                <IconButton
                  component={Link}
                  href={`/feature/detail/${user.id}`}
                  aria-label="자세히 보기"
                  color="primary"
                >
                  <SearchIcon />
                </IconButton>
              </TableCell>
              <TableCell align="center">
                <IconButton
                  component={Link}
                  href={`/feature/detail/${user.id}`}
                  aria-label="수정하기"
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell align="center">
                <IconButton
                  aria-label="삭제하기"
                  color="error"
                  onClick={() => {
                    if (!confirm("정말 삭제할까요?")) return;
                    dispatch(deleteEmployeeRequested(user.id));
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default UserListPage;

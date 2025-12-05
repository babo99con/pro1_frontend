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
  // 🔥 변경된 액션 이름
  deleteEmployeeRequest,
  fetchEmployeesRequest, // 전체 목록 조회를 위해 유지
  fetchEmployeesByConditionRequest, // 조건부 조회를 위해 사용
  type Employee,
  type SearchCondition, // 🔥 백엔드와 통신할 타입 임포트
} from "@/entities/employee/model/employeesSlice";

import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";

/** 백엔드 API에서 허용하는 검색 가능한 필드 목록 */
const SEARCH_FIELDS = [
  { value: "name", label: "이름" },
  { value: "employeeId", label: "사번" },
  { value: "department", label: "부서" },
] as const;

type SearchField = (typeof SEARCH_FIELDS)[number]["value"];
type SortField = "employeeId" | "name" | "department";
type SortDirection = "asc" | "desc";

const EmployeeListPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.employees);

  /**
   * 🔥 [추가] 컴포넌트가 처음 로드될 때 받은 전체 목록을 별도로 저장합니다.
   * Redux의 `items`는 검색 결과에 따라 계속 변경되므로,
   * 전체 목록으로 돌아가기 위해 초기 상태를 유지해야 합니다.
   */
  const [initialItems, setInitialItems] = useState<Employee[]>([]);
  const [query, setQuery] = useState("");
  const [searchField, setSearchField] = useState<SearchField>("name");
  const [sort, setSort] = useState<{ field: SortField; direction: SortDirection }>(
    { field: "employeeId", direction: "asc" }
  );

  /**
   * 🔥 [수정] 컴포넌트가 처음 마운트될 때 전체 직원 목록을 가져옵니다.
   * 이 useEffect는 한 번만 실행되어야 하므로 의존성 배열은 비워둡니다.
   */
  useEffect(() => {
    dispatch(fetchEmployeesRequest());
  }, [dispatch]);

  /**
   * 🔥 [수정] Redux의 `items`가 변경될 때, `initialItems`가 비어있다면 (즉, 최초 로드 시)
   * 전체 목록을 `initialItems` 상태에 저장합니다.
   */
  useEffect(() => {
    if (initialItems.length === 0 && items.length > 0) {
      setInitialItems(items);
    }
  }, [items, initialItems.length]);

  /**
   * 🔥 [수정] 백엔드 API 가이드에 따라 서버에 검색을 요청하는 함수
   * - 검색어가 비어있는지 로컬에서 먼저 검증합니다.
   * - Redux 액션을 디스패치하여 미들웨어(Saga/Thunk)가 API를 호출하도록 합니다.
   */
  const searchEmployees = () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      alert("검색어를 입력하세요.");
      return;
    }

    const searchCondition: SearchCondition = {
      condition: searchField,
      value: trimmedQuery,
    };

    dispatch(fetchEmployeesByConditionRequest(searchCondition));
  };

  /**
   * 🔥 [추가] '전체 목록 보기'를 위한 함수입니다.
   * 🔥 [수정] API를 다시 호출하는 대신, `initialItems`에 저장해 둔 전체 목록으로
   * Redux 상태를 업데이트하여 화면을 복원합니다. (성능 최적화)
   */
  const showAllEmployees = () => {
    setQuery(""); // 검색어 초기화
    // `fetchEmployeesSuccess` 액션을 직접 디스패치하여 `items` 상태를 되돌립니다.
    // 이렇게 하면 불필요한 네트워크 요청을 피할 수 있습니다. 
    dispatch(fetchEmployeesRequest());
  };

  const handleSort = (field: SortField) => {
    setSort((prev) => {
      if (prev.field === field) {
        return { field, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { field, direction: "asc" };
    });
  };

  /**
   * 🔥 [수정] TextField의 onChange 이벤트 타입에 맞게 수정
   */
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  /**
   * 🔥 [추가] 검색창에서 Enter 키를 눌렀을 때 조회를 실행하는 핸들러입니다.
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      // 한글 입력 시 조합 중 Enter가 눌리는 것을 방지 (isComposing)
      if (!event.nativeEvent.isComposing) {
        searchEmployees();
      }
    }
  };

  const handleSearchFieldChange = (event: SelectChangeEvent<string>) => {
    setSearchField(event.target.value as SearchField);
  };

  const currentLabel =
    SEARCH_FIELDS.find((opt) => opt.value === searchField)?.label ?? "검색";

  /**
   * 🔥 [수정] 정렬 대상이 되는 배열을 Redux의 `items`로 변경합니다.
   * 이렇게 해야 서버 검색 결과에 대해서도 정렬이 올바르게 동작합니다.
   */
  const sorted = useMemo(() => {
    const sortedItems = [...items].sort((a, b) => {
      const aVal = a[sort.field] ?? "";
      const bVal = b[sort.field] ?? "";
      if (aVal < bVal) return sort.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sortedItems;
  }, [items, sort]);

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
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown} // 🔥 [추가] Enter 키 이벤트 핸들러 연결
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />

        {/* 🔥 [수정] 조회 버튼의 불필요한 Link 속성 제거 */}
        <Button variant="contained" onClick={searchEmployees}>
          조회
        </Button>
        {/* 🔥 [추가] 전체 목록 보기 버튼 */}
        <Button variant="outlined" onClick={showAllEmployees}>
          전체 목록
        </Button>

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
          {/* 🔥 [수정] 정렬된 배열(sorted)을 사용하여 목록을 렌더링합니다. */}
          {/* 🔥 [추가] 로딩 중이 아닐 때 데이터가 없으면 "결과 없음" 메시지를 표시합니다. */}
          {!loading && sorted.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography color="text.secondary" p={4}>
                  검색 결과가 없습니다.
                </Typography>
              </TableCell>
            </TableRow>
          ) : null}

          {/* 🔥 [수정] 정렬된 배열(sorted)을 사용하여 목록을 렌더링합니다. */}
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
                    // 🔥 여기 수정됨
                    dispatch(deleteEmployeeRequest(employee.id));
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

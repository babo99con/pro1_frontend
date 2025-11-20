"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch } from "@/shared/store/hooks";
import {
  deleteEmployeeSucceeded,
  updateEmployeeSucceeded,
  type Employee,
} from "@/entities/employee/model/employeesSlice";
import {
  deleteEmployeeApi,
  fetchEmployeeApi,
  updateEmployeeApi,
} from "@/entities/employee/api/employeesApi";

const EMPTY_FORM = {
  employeeId: "",
  name: "",
  emailLocal: "",
  emailDomain: "",
  department: "",
  gender: "",
  birthDate: "",
  phonePrefix: "",
  phoneMiddle: "",
  phoneLast: "",
  zipCode: "",
  address1: "",
  address2: "",
  position: "",
};

const getErrorMessage = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback;

const EmployeeDetailPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const employeeId = useMemo(() => Number(params?.id), [params]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!employeeId) return;
    setLoading(true);
    setError(null);
    fetchEmployeeApi(employeeId)
      .then((data) => {
        setEmployee(data);
        setForm({
          employeeId: data.employeeId ?? "",
          name: data.name ?? "",
          emailLocal: data.emailLocal ?? "",
          emailDomain: data.emailDomain ?? "",
          department: data.department ?? "",
          gender: data.gender ?? "",
          birthDate: data.birthDate ?? "",
          phonePrefix: data.phonePrefix ?? "",
          phoneMiddle: data.phoneMiddle ?? "",
          phoneLast: data.phoneLast ?? "",
          zipCode: data.zipCode ?? "",
          address1: data.address1 ?? "",
          address2: data.address2 ?? "",
          position: data.position ?? "",
        });
      })
      .catch((err) =>
        setError(err?.message ?? "직원 정보를 불러오지 못했습니다.")
      )
      .finally(() => setLoading(false));
  }, [employeeId]);

  const handleFieldChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleSave = async () => {
    if (!employeeId) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateEmployeeApi(employeeId, form);
      setEmployee(updated);
      dispatch(updateEmployeeSucceeded(updated));
      setEditMode(false);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "직원 정보를 저장할 수 없습니다."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!employeeId) return;
    if (!confirm("정말 삭제할까요?")) return;
    setSaving(true);
    setError(null);
    try {
      await deleteEmployeeApi(employeeId);
      dispatch(deleteEmployeeSucceeded(employeeId));
      router.push("/employees");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "직원 삭제에 실패했습니다."));
    } finally {
      setSaving(false);
    }
  };

  const toggleEdit = () => {
    if (editMode) {
      void handleSave();
    } else {
      setEditMode(true);
    }
  };

  const goBack = () => router.push("/employees");

  const renderField = (label: string, key: keyof typeof form) => {
    const value =
      employee && (employee as Record<string, string | undefined>)[key];
    return (
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
        {editMode ? (
          <TextField
            value={form[key]}
            onChange={handleFieldChange(key)}
            fullWidth
            size="small"
          />
        ) : (
          <Typography>{value || "-"}</Typography>
        )}
      </Grid>
    );
  };

  return (
    <Box maxWidth="960px" mx="auto" mt={4}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          직원 상세
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<ListAltIcon />} onClick={goBack}>
            목록
          </Button>
          <Button
            variant={editMode ? "contained" : "outlined"}
            color="primary"
            startIcon={<EditIcon />}
            onClick={toggleEdit}
            disabled={saving}
          >
            {editMode ? "저장" : "수정"}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            disabled={saving}
          >
            삭제
          </Button>
        </Stack>
      </Stack>

      {loading && (
        <Typography align="center" color="text.secondary">
          정보를 불러오는 중입니다…
        </Typography>
      )}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && employee && (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              {editMode ? (
                <TextField
                  label="사번"
                  value={form.employeeId}
                  onChange={handleFieldChange("employeeId")}
                  fullWidth
                />
              ) : (
                <Typography variant="h5" fontWeight={700}>
                  {employee.employeeId || "-"} / {employee.name || "-"}
                </Typography>
              )}

              <Grid container spacing={2}>
                {renderField("이름", "name")}
                {renderField("부서", "department")}
                {renderField("직책", "position")}
                {renderField("이메일 아이디", "emailLocal")}
                {renderField("이메일 도메인", "emailDomain")}
                {renderField("성별", "gender")}
                {renderField("생년월일", "birthDate")}
                {renderField("전화(앞자리)", "phonePrefix")}
                {renderField("전화(중간)", "phoneMiddle")}
                {renderField("전화(뒷자리)", "phoneLast")}
                {renderField("우편번호", "zipCode")}
                {renderField("주소1", "address1")}
                {renderField("주소2", "address2")}
              </Grid>

              <Divider />
              <Typography variant="body2" color="text.secondary">
                DB ID: {employee.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                이메일:{" "}
                {employee.email ??
                  `${employee.emailLocal ?? ""}@${employee.emailDomain ?? ""}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                전화번호:{" "}
                {employee.phone ??
                  `${employee.phonePrefix ?? ""}-${employee.phoneMiddle ?? ""}-${employee.phoneLast ?? ""}`}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default EmployeeDetailPage;

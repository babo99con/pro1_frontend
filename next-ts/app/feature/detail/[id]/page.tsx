"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
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
import { useAppDispatch } from "../../../store/hooks";
import {
  deleteEmployeeSucceeded,
  updateEmployeeSucceeded,
} from "../../../store/features/users/usersSlice";
import {
  deleteEmployeeApi,
  updateEmployeeApi,
} from "../../../store/features/users/usersApi";

interface Employee {
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

const API_BASE =
  process.env.NEXT_PUBLIC_EMPLOYEE_API ?? "http://localhost:3001/api/employees";

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const employeeId = useMemo(() => Number(params?.id), [params]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
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
  });

  useEffect(() => {
    if (!employeeId) return;
    setLoading(true);
    setError(null);
    axios
      .get<Employee>(`${API_BASE}/${employeeId}`)
      .then((res) => {
        const data = res.data;
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
        setError(err?.message ?? "Failed to load employee information.")
      )
      .finally(() => setLoading(false));
  }, [employeeId]);

  const goBack = () => router.push("/employee");

  const handleFieldChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const saveChanges = async () => {
    if (!employeeId) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateEmployeeApi(employeeId, form);
      setEmployee(updated);
      dispatch(updateEmployeeSucceeded(updated));
      setEditMode(false);
    } catch (err: any) {
      setError(err?.message ?? "Failed to update employee information.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      void saveChanges();
    } else {
      setEditMode(true);
    }
  };

  const handleDelete = async () => {
    if (!employeeId) return;
    if (!confirm("Delete this employee?")) return;
    setSaving(true);
    setError(null);
    try {
      await deleteEmployeeApi(employeeId);
      dispatch(deleteEmployeeSucceeded(employeeId));
      router.push("/feature/list");
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete employee.");
    } finally {
      setSaving(false);
    }
  };

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
          <Typography>{value || "-"} </Typography>
        )}
      </Grid>
    );
  };

  return (
    <Box maxWidth="960px" mx="auto" mt={4}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Employee Detail
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<ListAltIcon />} onClick={goBack}>
            List
          </Button>
          <Button
            variant={editMode ? "contained" : "outlined"}
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleEditToggle}
            disabled={saving}
          >
            {editMode ? "Save" : "Edit"}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            disabled={saving}
          >
            Delete
          </Button>
        </Stack>
      </Stack>

      {loading && (
        <Typography align="center" color="text.secondary">
          Loading...
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
                {renderField("전화 앞자리", "phonePrefix")}
                {renderField("전화 중간", "phoneMiddle")}
                {renderField("전화 끝자리", "phoneLast")}
                {renderField("우편번호", "zipCode")}
                {renderField("주소1", "address1")}
                {renderField("주소2", "address2")}
              </Grid>

              <Divider />
              <Typography variant="body2" color="text.secondary">
                DB ID: {employee.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                이메일: {employee.email ?? `${employee.emailLocal ?? ""}@${employee.emailDomain ?? ""}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                전화: {employee.phone ?? `${employee.phonePrefix ?? ""}-${employee.phoneMiddle ?? ""}-${employee.phoneLast ?? ""}`}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

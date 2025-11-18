"use client";

import React, { FormEvent, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import {
  createEmployeeRequested,
  fetchEmployeesRequested,
} from "../../store/features/users/usersSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

declare global {
  interface Window {
    daum?: {
      Postcode: new (
        options: { oncomplete: (data: Record<string, any>) => void }
      ) => {
        open: () => void;
      };
    };
  }
}

const DAUM_POSTCODE_SCRIPT =
  "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.users);

  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    emailLocal: "",
    emailDomain: "naver.com",
    department: "",
    gender: "",
    birthDate: "",
    phonePrefix: "010",
    phoneMiddle: "",
    phoneLast: "",
    zipCode: "",
    address1: "",
    address2: "",
    position: "",
  });
  const [toastOpen, setToastOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployeesRequested());
  }, [dispatch]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const existing = document.querySelector(
      `script[src="${DAUM_POSTCODE_SCRIPT}"]`
    );
    if (existing) return;
    const script = document.createElement("script");
    script.src = DAUM_POSTCODE_SCRIPT;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!submitted || loading) return;
    if (!error) {
      setToastOpen(true);
      setForm({
        employeeId: "",
        name: "",
        emailLocal: "",
        emailDomain: "naver.com",
        department: "",
        gender: "",
        birthDate: "",
        phonePrefix: "010",
        phoneMiddle: "",
        phoneLast: "",
        zipCode: "",
        address1: "",
        address2: "",
        position: "",
      });
    }
    setSubmitted(false);
  }, [submitted, loading, error]);

  const handleChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleAddressSearch = () => {
    if (typeof window === "undefined") return;
    if (!window.daum?.Postcode) {
      alert("주소 검색 스크립트가 아직 준비되지 않았어요. 잠시 후 다시 시도해주세요.");
      return;
    }
    new window.daum.Postcode({
      oncomplete: (data: Record<string, any>) => {
        const address =
          data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;
        setForm((prev) => ({
          ...prev,
          zipCode: data.zonecode || "",
          address1: address || "",
        }));
      },
    }).open();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(createEmployeeRequested(form));
    setSubmitted(true);
  };

  return (
    <Box maxWidth="520px" mx="auto" mt={5}>
      <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
        직원 등록
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="사번"
            value={form.employeeId}
            onChange={handleChange("employeeId")}
            required
          />
          <TextField
            label="이름"
            value={form.name}
            onChange={handleChange("name")}
            required
          />
          <Stack direction="row" spacing={1}>
            <TextField
              label="이메일 아이디"
              value={form.emailLocal}
              onChange={handleChange("emailLocal")}
              sx={{ flex: 1 }}
            />
            <Typography sx={{ alignSelf: "center" }}>@</Typography>
            <TextField
              label="도메인"
              value={form.emailDomain}
              onChange={handleChange("emailDomain")}
              sx={{ flex: 1 }}
            />
          </Stack>
          <Stack direction="row" spacing={1}>
            <TextField
              label="전화 앞자리"
              value={form.phonePrefix}
              onChange={handleChange("phonePrefix")}
              sx={{ width: 120 }}
            />
            <TextField
              label="중간"
              value={form.phoneMiddle}
              onChange={handleChange("phoneMiddle")}
              sx={{ width: 140 }}
            />
            <TextField
              label="끝자리"
              value={form.phoneLast}
              onChange={handleChange("phoneLast")}
              sx={{ width: 140 }}
            />
          </Stack>
          <TextField
            label="부서"
            value={form.department}
            onChange={handleChange("department")}
          />
          <TextField
            label="직책"
            value={form.position}
            onChange={handleChange("position")}
          />
          <Stack direction="row" spacing={1}>
            <TextField
              label="성별(M/F)"
              value={form.gender}
              onChange={handleChange("gender")}
              sx={{ width: 140 }}
            />
            <TextField
              label="생년월일"
              type="date"
              value={form.birthDate}
              onChange={handleChange("birthDate")}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
          </Stack>
          <Stack direction="row" spacing={1}>
            <TextField
              label="우편번호"
              value={form.zipCode}
              onChange={handleChange("zipCode")}
              sx={{ width: 180 }}
            />
            <Button variant="outlined" onClick={handleAddressSearch}>
              주소 찾기
            </Button>
          </Stack>
          <TextField
            label="주소1"
            value={form.address1}
            onChange={handleChange("address1")}
          />
          <TextField
            label="주소2"
            value={form.address2}
            onChange={handleChange("address2")}
          />

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => router.push("/employee")}>
              목록
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "처리 중..." : "등록하기"}
            </Button>
          </Stack>
        </Stack>
      </form>

      <Snackbar
        open={toastOpen}
        autoHideDuration={2500}
        onClose={() => setToastOpen(false)}
        message="신규 직원이 등록되었습니다."
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default RegisterPage;

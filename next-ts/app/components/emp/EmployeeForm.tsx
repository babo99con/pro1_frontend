"use client";

import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";

interface EmployeeFormData {
  employeeId: string;
  name: string;
  emailId: string;
  emailDomain: string;
  customDomain: string;
  email: string;
  emailError?: string;
  department: string;
  gender: string;
  birthDate: string;
  phonePrefix: string;
  phoneMiddle: string;
  phoneLast: string;
  postcode: string;
  address: string;
  detailAddress: string;
  extraAddress: string;
}

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

const EmployeeForm: React.FC = () => {
  const [form, setForm] = useState<EmployeeFormData>({
    employeeId: "",
    name: "",
    emailId: "",
    emailDomain: "naver.com",
    customDomain: "",
    email: "",
    department: "",
    gender: "",
    birthDate: "",
    phonePrefix: "010",
    phoneMiddle: "",
    phoneLast: "",
    postcode: "",
    address: "",
    detailAddress: "",
    extraAddress: "",
  });

  const lastPhoneRef = useRef<HTMLInputElement>(null);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (typeof document === "undefined") return;

    const existingScript = document.querySelector(
      `script[src="${DAUM_POSTCODE_SCRIPT}"]`
    );
    if (existingScript) return;

    const script = document.createElement("script");
    script.src = DAUM_POSTCODE_SCRIPT;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // 이메일 전체 업데이트
  const updateEmail = (
    id: string,
    domain: string,
    customDomain: string
  ): string => {
    const finalDomain = domain === "직접입력" ? customDomain : domain;
    return id && finalDomain ? `${id}@${finalDomain}` : "";
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
    const newEmail = updateEmail(
      updated.emailId,
      updated.emailDomain,
      updated.customDomain
    );
    return {
      ...updated,
      email: newEmail,
      emailError:
        newEmail === "" || emailRegex.test(newEmail)
          ? ""
          : "이메일 형식을 확인해 주세요.",
    };
    });
  };

  const handleDomainSelect = (e: SelectChangeEvent<string>) => {
    const domain = e.target.value;
    setForm((prev) => {
      const newEmail = updateEmail(prev.emailId, domain, prev.customDomain);
      return { ...prev, emailDomain: domain, email: newEmail };
    });
  };

  const handleCustomDomainChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm((prev) => {
      const newEmail = updateEmail(prev.emailId, prev.emailDomain, value);
      return { ...prev, customDomain: value, email: newEmail };
    });
  };

  // 공통 입력 처리
  const handleChange = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    if (!name) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 전화번호
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const digitsOnly = value.replace(/[^0-9]/g, "");
    let maxLength = 4;
    if (name === "phoneMiddle" && form.phonePrefix !== "010") {
      maxLength = 3;
    }
    const truncated = digitsOnly.slice(0, maxLength);
    setForm((prev) => ({ ...prev, [name]: truncated }));
    if (name === "phoneMiddle" && truncated.length === maxLength) {
      lastPhoneRef.current?.focus();
    }
  };

  const handlePhonePrefixChange = (event: SelectChangeEvent<string>) => {
    setForm((prev) => ({
      ...prev,
      phonePrefix: event.target.value,
      phoneMiddle: "",
      phoneLast: "",
    }));
  };

  // 다음 주소 API
  const handleAddressSearch = () => {
    if (typeof window === "undefined") return;
    if (!window.daum || !window.daum.Postcode) {
      alert("주소 검색 스크립트가 아직 준비되지 않았습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    new window.daum.Postcode({
      oncomplete: (data: Record<string, any>) => {
        let address =
          data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;
        let extraAddress = "";

        if (data.userSelectedType === "R") {
          if (data.bname && /[동|로|가]$/g.test(data.bname)) {
            extraAddress += data.bname;
          }
          if (data.buildingName && data.apartment === "Y") {
            extraAddress += extraAddress
              ? `, ${data.buildingName}`
              : data.buildingName;
          }
          if (extraAddress) extraAddress = ` (${extraAddress})`;
        }

        setForm((prev) => ({
          ...prev,
          postcode: data.zonecode || "",
          address,
          extraAddress,
        }));
      },
    }).open();
  };

  // 폼 제출
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fullPhone = `${form.phonePrefix}-${form.phoneMiddle}-${form.phoneLast}`;
    alert(
      `등록 완료!\n${JSON.stringify(
        { ...form, phone: fullPhone, email: form.email },
        null,
        2
      )}`
    );
  };

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Box width="100%" maxWidth="600px">
        <Typography variant="h4" align="center" gutterBottom>
          직원 등록
        </Typography>

        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            인적 사항
          </Typography>

          <TextField
            margin="normal"
            fullWidth
            label="직원 아이디"
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            required
          />
          <br />

          <TextField
            margin="normal"
            fullWidth
            label="직원 이름"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <br />

          <FormLabel>이메일</FormLabel>
          <Box display="flex" alignItems="center">
            <TextField
              margin="normal"
              label="아이디"
              name="emailId"
              value={form.emailId}
              onChange={handleEmailChange}
            />
            <Typography>@</Typography>

            <FormControl margin="normal">
              <InputLabel id="domain-select-label">도메인</InputLabel>
              <Select
                labelId="domain-select-label"
                label="도메인"
                name="emailDomain"
                value={form.emailDomain}
                onChange={handleDomainSelect}
              >
                <MenuItem value="naver.com">naver.com</MenuItem>
                <MenuItem value="gmail.com">gmail.com</MenuItem>
                <MenuItem value="daum.net">daum.net</MenuItem>
                <MenuItem value="nate.com">nate.com</MenuItem>
                <MenuItem value="직접입력">직접입력</MenuItem>
              </Select>
            </FormControl>

            {form.emailDomain === "직접입력" && (
              <TextField
                margin="normal"
                label="직접입력"
                name="customDomain"
                value={form.customDomain}
                onChange={handleCustomDomainChange}
              />
            )}
          </Box>

          <p></p>

          <FormControl fullWidth margin="normal">
            <InputLabel id="dept-label">부서명</InputLabel>
            <Select
              labelId="dept-label"
              label="부서명"
              name="department"
              value={form.department}
              onChange={handleChange}
            >
              <MenuItem value="accounting">회계</MenuItem>
              <MenuItem value="sales">영업</MenuItem>
              <MenuItem value="hr">인사</MenuItem>
              <MenuItem value="it">IT</MenuItem>
            </Select>
          </FormControl>

          <p></p>

          <FormControl margin="normal">
            <FormLabel>성별</FormLabel>
            <RadioGroup
              row
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <FormControlLabel value="M" control={<Radio />} label="남" />
              <FormControlLabel value="F" control={<Radio />} label="여" />
            </RadioGroup>
          </FormControl>

          <br />

          <TextField
            margin="normal"
            fullWidth
            label="생년월일"
            name="birthDate"
            type="date"
            value={form.birthDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          <p></p>

          <FormLabel>전화번호</FormLabel>
          <Box display="flex" alignItems="center">
            <FormControl margin="normal">
              <InputLabel id="phone-prefix-label">번호</InputLabel>
              <Select
                labelId="phone-prefix-label"
                label="번호"
                name="phonePrefix"
                value={form.phonePrefix}
                onChange={handlePhonePrefixChange}
              >
                <MenuItem value="010">010</MenuItem>
                <MenuItem value="011">011</MenuItem>
                <MenuItem value="016">016</MenuItem>
                <MenuItem value="017">017</MenuItem>
                <MenuItem value="018">018</MenuItem>
                <MenuItem value="019">019</MenuItem>
              </Select>
            </FormControl>

            <Typography>-</Typography>

            <TextField
              margin="normal"
              name="phoneMiddle"
              value={form.phoneMiddle}
              onChange={handlePhoneChange}
              inputProps={{
                maxLength: form.phonePrefix === "010" ? 4 : 3,
                inputMode: "numeric",
              }}
            />

            <Typography>-</Typography>

            <TextField
              margin="normal"
              name="phoneLast"
              value={form.phoneLast}
              onChange={handlePhoneChange}
              inputProps={{
                maxLength: 4,
                inputMode: "numeric",
              }}
              inputRef={lastPhoneRef}
            />
          </Box>

          <p></p>

          <Typography variant="h6" gutterBottom>
            주소
          </Typography>

          <TextField
            margin="normal"
            fullWidth
            label="우편번호"
            name="postcode"
            value={form.postcode}
            onChange={handleChange}
          />
          <br />

          <Button
            type="button"
            variant="outlined"
            fullWidth
            onClick={handleAddressSearch}
          >
            우편번호 찾기
          </Button>
          <br />

          <TextField
            margin="normal"
            fullWidth
            label="주소"
            name="address"
            value={form.address}
            onChange={handleChange}
          />
          <br />

          <TextField
            margin="normal"
            fullWidth
            label="상세 주소"
            name="detailAddress"
            value={form.detailAddress}
            onChange={handleChange}
          />

          <p></p>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            등록하기
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default EmployeeForm;

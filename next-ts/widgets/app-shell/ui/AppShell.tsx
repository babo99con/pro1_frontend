"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Box, Toolbar } from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import NavBar from "./NavBar";
import SideBar, { type NavGroup } from "./SideBar";

const TOP_MENU = [{ label: "Home", href: "/" }];

const NAV_GROUPS: NavGroup[] = [
  {
    key: "employees",
    title: "직원 관리",
    items: [
      { href: "/employees", label: "직원 목록", icon: <ListAltIcon fontSize="small" /> },
      { href: "/employees/new", label: "직원 등록", icon: <AddCircleOutlineIcon fontSize="small" /> },
    ],
  },
];

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    employees: true,
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!mounted) return null;

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh" }}>
      <NavBar title="직원 관리 콘솔" items={TOP_MENU} activePath={pathname} />
      <Toolbar />
      <Box
        sx={{
          display: "flex",
          px: { xs: 10, md: 3 },
          py: { xs: 2, md: 3 },
          gap: 3,
        }}
      >
        <SideBar
          groups={NAV_GROUPS}
          openGroups={openGroups}
          onToggle={toggleGroup}
          activePath={pathname}
        />
        <Box
          component="main"
          sx={{
            flex: 1,
            bgcolor: "background.paper",
            borderRadius: 2,
            p: { xs: 2, md: 3 },
            boxShadow: (theme) => theme.shadows[1],
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AppShell;

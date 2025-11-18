"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Box,
  Button,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const TOP_MENU = [{ label: "Home", href: "/" }];

const FULL_ITEMS = [
  { key: "list", label: "목록", icon: <ListAltIcon fontSize="small" /> },
  { key: "create", label: "생성", icon: <AddCircleOutlineIcon fontSize="small" /> },
  // { key: "update", label: "수정", icon: <EditNoteIcon fontSize="small" /> },
  // { key: "delete", label: "삭제", icon: <DeleteOutlineIcon fontSize="small" /> },
];

const LIST_ONLY = [{ key: "list", label: "목록", icon: <ListAltIcon fontSize="small" /> }];

const SIDE_SECTIONS = [
  { key: "employee", title: "Users", base: "/employee", items: FULL_ITEMS },
  { key: "posts", title: "Posts", base: "/posts", items: LIST_ONLY },
  { key: "comments", title: "Comments", base: "/comments", items: LIST_ONLY },
  { key: "albums", title: "Albums", base: "/albums", items: LIST_ONLY },
  { key: "photos", title: "Photos", base: "/photos", items: LIST_ONLY },
  { key: "todos", title: "Todos", base: "/todos", items: LIST_ONLY },
];

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    employee: true,
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const showSidebar = true;

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSection = (section: (typeof SIDE_SECTIONS)[number]) => {
    const isOpen = !!openSections[section.key];
    return (
      <Box key={section.key}>
        <ListItemButton
          onClick={() => toggleSection(section.key)}
          sx={{
            color: "inherit",
            px: 2,
            "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
          }}
        >
          <ListItemText primary={section.title} />
        </ListItemButton>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List disablePadding>
            {section.items.map((item) => {
              const href = `${section.base}${item.key === "list" ? "" : `/${item.key}`}`;
              const active = pathname === href;
              return (
                <ListItemButton
                  key={`${section.key}-${item.key}`}
                  component={Link}
                  href={href}
                  selected={active}
                  sx={{
                    pl: 5,
                    color: "inherit",
                    "&.Mui-selected": {
                      bgcolor: "rgba(0,0,0,0.06)",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.08)" },
                    },
                    "&:hover": {
                      bgcolor: "rgba(0,0,0,0.04)",
                      "& .menu-label": { color: "#000" },
                    },
                    "& .menu-label": {
                      color: "grey.500",
                      transition: "color 0.2s ease",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 28 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ className: "menu-label" }} />
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
        <Divider />
      </Box>
    );
  };

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={700}>
            직원 관리 콘솔
          </Typography>
          <Stack direction="row" spacing={1}>
            {TOP_MENU.map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                color="primary"
                variant={pathname === item.href ? "contained" : "text"}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Toolbar>
      </AppBar>

      <Toolbar />
      <Box
        sx={{
          display: "flex",
          px: { xs: 1, md: 3 },
          py: { xs: 2, md: 3 },
          gap: showSidebar ? 3 : 0,
        }}
      >
        {showSidebar && (
          <Box
            sx={{
              width: 240,
              flexShrink: 0,
              bgcolor: "grey.100",
              color: "text.primary",
              borderRadius: 2,
              overflow: "hidden",
              position: "sticky",
              top: 88,
              alignSelf: "flex-start",
              boxShadow: (theme) => theme.shadows[2],
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography fontWeight={700} fontSize="1rem">
                통합 메뉴
              </Typography>
            </Box>
            <Divider />
            <List dense disablePadding>{SIDE_SECTIONS.map((section) => renderSection(section))}</List>
          </Box>
        )}

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
}

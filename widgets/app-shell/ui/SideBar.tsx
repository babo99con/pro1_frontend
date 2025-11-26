"use client";

import * as React from "react";
import Link from "next/link";
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

export interface NavGroup {
  key: string;
  title: string;
  items: { href: string; label: string; icon: React.ReactNode }[];
}

interface SideBarProps {
  groups: NavGroup[];
  openGroups: Record<string, boolean>;
  onToggle: (key: string) => void;
  activePath: string;
}

const SideBar = ({ groups, openGroups, onToggle, activePath }: SideBarProps) => (
  <Box
    sx={{
      width: 240,
      flexShrink: 0,
      bgcolor: "grey.100",
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
        주요 메뉴
      </Typography>
    </Box>
    <Divider />
    <List dense disablePadding>
      {groups.map((group) => (
        <Box key={group.key}>
          <ListItemButton
            onClick={() => onToggle(group.key)}
            sx={{
              px: 2,
              "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
            }}
          >
            <ListItemText primary={group.title} />
          </ListItemButton>
          <Collapse in={!!openGroups[group.key]} timeout="auto" unmountOnExit>
            <List disablePadding>
              {group.items.map((item) => {
                const active = activePath === item.href;
                return (
                  <ListItemButton
                    key={item.href}
                    component={Link}
                    href={item.href}
                    selected={active}
                    sx={{
                      pl: 5,
                      "&.Mui-selected": {
                        bgcolor: "rgba(0,0,0,0.08)",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.12)" },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 28, color: "inherit" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                );
              })}
            </List>
          </Collapse>
          <Divider />
        </Box>
      ))}
    </List>
  </Box>
);

export default SideBar;

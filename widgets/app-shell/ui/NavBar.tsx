"use client";

import Link from "next/link";
import { AppBar, Button, Stack, Toolbar, Typography } from "@mui/material";

interface NavBarProps {
  title: string;
  items: { label: string; href: string }[];
  activePath: string;
}

const NavBar = ({ title, items, activePath }: NavBarProps) => (
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
        {title}
      </Typography>
      <Stack direction="row" spacing={1}>
        {items.map((item) => (
          <Button
            key={item.href}
            component={Link}
            href={item.href}
            color="primary"
            variant={activePath === item.href ? "contained" : "text"}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
    </Toolbar>
  </AppBar>
);

export default NavBar;

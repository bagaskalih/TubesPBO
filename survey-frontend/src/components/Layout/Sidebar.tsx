import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  useTheme,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Assignment,
  LineStyle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  role: string;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate();

  const menuItems =
    role === "ADMIN"
      ? [
          { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
          { text: "User Management", icon: <People />, path: "/users" },
          { text: "Survey Management", icon: <Assignment />, path: "/surveys" },
        ]
      : [
          { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
          {
            text: "Available Surveys",
            icon: <Assignment />,
            path: "/available-surveys",
          },
          { text: "My Surveys", icon: <LineStyle />, path: "/my-surveys" },
        ];

  return (
    <Box sx={{ display: "flex" }}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={() => setOpen(!open)}
        edge="start"
        sx={{ mr: 2, position: "fixed", left: 16, top: 16, zIndex: 1201 }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            top: "64px",
            height: "calc(100% - 64px)",
          },
        }}
      >
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem
              component="div"
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.primary.light,
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.common.white,
                  },
                  "& .MuiListItemText-primary": {
                    color: theme.palette.common.white,
                  },
                },
                cursor: "pointer",
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;

import React from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  username: string;
  role: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  username,
  role,
}) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Header username={username} />
      <Sidebar role={role} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: "240px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;

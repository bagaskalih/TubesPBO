import React from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  username: string;
  role: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, username }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Header username={username} />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;

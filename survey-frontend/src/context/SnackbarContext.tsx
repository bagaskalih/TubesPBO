import React, { createContext, useState, useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface SnackbarContextType {
  showSnackbar: (message: string, severity: "success" | "error") => void;
  snackbar: {
    open: boolean;
    message: string;
    severity: "success" | "error";
  };
  handleClose: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const SnackbarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleClose = () => setSnackbar({ ...snackbar, open: false });

  return (
    <SnackbarContext.Provider value={{ showSnackbar, snackbar, handleClose }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={handleClose}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context)
    throw new Error("useSnackbar must be used within SnackbarProvider");
  return context;
};

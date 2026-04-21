import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: { main: "#7c3aed", contrastText: "#ffffff" },
    secondary: { main: "#f59e0b", contrastText: "#ffffff" },
    success: { main: "#10b981", contrastText: "#ffffff" },
    error: { main: "#ef4444", contrastText: "#ffffff" },
    warning: { main: "#f59e0b", contrastText: "#ffffff" },
    background: {
      default: "#eef0f8",
      paper: "#ffffff",
    },
    text: {
      primary: "#111827",
      secondary: "#6b7280",
    },
    divider: "rgba(0,0,0,0.07)",
  },
  shape: { borderRadius: 12 },
  shadows: [
    "none",
    "0 1px 2px rgba(0,0,0,0.05)",
    "0 1px 4px rgba(0,0,0,0.06)",
    "0 2px 6px rgba(0,0,0,0.07)",
    "0 2px 8px rgba(0,0,0,0.08)",
    "0 4px 12px rgba(0,0,0,0.08)",
    "0 4px 16px rgba(0,0,0,0.10)",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
  ],
  typography: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, borderRadius: "8px" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "14px",
          boxShadow: "none",
          border: "1px solid rgba(0,0,0,0.06)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { boxShadow: "none" } },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            fontWeight: 600,
            backgroundColor: "#f9fafb",
            borderBottom: "1px solid rgba(0,0,0,0.07)",
            color: "#6b7280",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: "1px solid rgba(0,0,0,0.05)" },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td, &:last-child th": { border: 0 },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: { boxShadow: "none", borderRadius: 0 },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRight: "none", boxShadow: "none" },
      },
    },
    MuiAppBar: {
      styleOverrides: { root: { boxShadow: "none" } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "14px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: "6px", fontWeight: 600, fontSize: "0.75rem" },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        root: { "& .MuiOutlinedInput-root": { borderRadius: "8px" } },
      },
    },
  },
});

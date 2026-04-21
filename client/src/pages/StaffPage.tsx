import { useEffect, useState, useCallback } from "react";
import { Typography, Button, Box, Snackbar, Alert, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { Staff, StaffFormData } from "../types/Staff";
import {
  fetchStaffList,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../api/staff";
import StaffTable from "../components/StaffTable";
import StaffForm from "../components/StaffForm";

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const loadStaff = useCallback(async () => {
    try {
      setStaff(await fetchStaffList());
    } catch {
      showSnackbar("Failed to load staff", "error");
    }
  }, []);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (s: Staff) => {
    setEditing(s);
    setFormOpen(true);
  };

  const handleDelete = async (s: Staff) => {
    try {
      await deleteStaff(s.id);
      showSnackbar("Staff member deleted", "success");
      loadStaff();
    } catch {
      showSnackbar("Failed to delete staff member", "error");
    }
  };

  const handleSave = async (data: StaffFormData) => {
    try {
      if (editing) {
        await updateStaff(editing.id, data);
        showSnackbar("Employee updated", "success");
      } else {
        await createStaff(data);
        showSnackbar("Employee created", "success");
      }
      setFormOpen(false);
      loadStaff();
    } catch {
      showSnackbar("Failed to save employee", "error");
    }
  };

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4">Employee Management</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Manage your team members and their access levels.
        </Typography>
      </Box>

      <Paper
        sx={{
          borderRadius: "14px",
          border: "1px solid rgba(0,0,0,0.06)",
          overflow: "hidden",
          bgcolor: "#fff",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {staff.length} {staff.length === 1 ? "employee" : "employees"}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Employee
          </Button>
        </Box>
        <StaffTable staff={staff} onEdit={handleEdit} onDelete={handleDelete} />
      </Paper>

      <StaffForm
        open={formOpen}
        staff={editing}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

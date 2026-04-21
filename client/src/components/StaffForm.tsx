import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid2 as Grid,
  Switch,
  FormControlLabel,
  MenuItem,
} from "@mui/material";
import type { Staff, StaffFormData } from "../types/Staff";

const emptyForm: StaffFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  pin: null,
  role: "cashier",
  isActive: true,
};

interface Props {
  open: boolean;
  staff: Staff | null;
  onClose: () => void;
  onSave: (data: StaffFormData) => void;
}

export default function StaffForm({ open, staff, onClose, onSave }: Props) {
  const [form, setForm] = useState<StaffFormData>(
    staff
      ? {
          firstName: staff.firstName,
          lastName: staff.lastName,
          email: staff.email,
          password: "",
          pin: staff.pin,
          role: staff.role,
          isActive: staff.isActive,
        }
      : { ...emptyForm },
  );

  const handleChange =
    (field: keyof StaffFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value || null }));
    };

  const handleSubmit = () => {
    const data = { ...form };
    if (staff && !data.password) {
      const { password: _, ...rest } = data;
      onSave(rest as StaffFormData);
    } else {
      onSave(data);
    }
  };

  const isValid =
    form.firstName && form.lastName && form.email && (staff || form.password);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{staff ? "Edit Staff" : "New Staff Member"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="First Name"
              fullWidth
              required
              value={form.firstName}
              onChange={handleChange("firstName")}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="Last Name"
              fullWidth
              required
              value={form.lastName}
              onChange={handleChange("lastName")}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={form.email}
              onChange={handleChange("email")}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              label={staff ? "Password (leave blank to keep)" : "Password"}
              type="password"
              fullWidth
              required={!staff}
              value={form.password}
              onChange={handleChange("password")}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="PIN (4 digits)"
              fullWidth
              value={form.pin ?? ""}
              onChange={handleChange("pin")}
              slotProps={{ htmlInput: { maxLength: 4 } }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="Role"
              select
              fullWidth
              value={form.role}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  role: e.target.value as StaffFormData["role"],
                }))
              }
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="cashier">Cashier</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                />
              }
              label="Active"
              sx={{ mt: 1 }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!isValid}>
          {staff ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

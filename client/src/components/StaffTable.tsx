import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Staff } from "../types/Staff";

const roleColors: Record<string, "primary" | "secondary" | "default"> = {
  admin: "primary",
  manager: "secondary",
  cashier: "default",
};

interface Props {
  staff: Staff[];
  onEdit: (s: Staff) => void;
  onDelete: (s: Staff) => void;
}

export default function StaffTable({ staff, onEdit, onDelete }: Props) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell align="center">Role</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {staff.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                No staff members found.
              </TableCell>
            </TableRow>
          )}
          {staff.map((s) => (
            <TableRow key={s.id} hover>
              <TableCell>
                {s.firstName} {s.lastName}
              </TableCell>
              <TableCell>{s.email}</TableCell>
              <TableCell align="center">
                <Chip
                  label={s.role}
                  color={roleColors[s.role] ?? "default"}
                  size="small"
                  sx={{ textTransform: "capitalize" }}
                />
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={s.isActive ? "Active" : "Inactive"}
                  color={s.isActive ? "success" : "default"}
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => onEdit(s)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(s)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

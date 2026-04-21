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
import type { Product } from "../types/Product";

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: Props) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>SKU</TableCell>
            <TableCell>Category</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Cost</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                No products found. Add your first product to get started.
              </TableCell>
            </TableRow>
          )}
          {products.map((product) => (
            <TableRow key={product.id} hover>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.category ?? "—"}</TableCell>
              <TableCell align="right">
                ${Number(product.price).toFixed(2)}
              </TableCell>
              <TableCell align="right">
                ${Number(product.cost).toFixed(2)}
              </TableCell>
              <TableCell align="right">{product.quantity}</TableCell>
              <TableCell align="center">
                <Chip
                  label={product.isActive ? "Active" : "Inactive"}
                  color={product.isActive ? "success" : "default"}
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => onEdit(product)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(product)}
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

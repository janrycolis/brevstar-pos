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
  InputAdornment,
} from "@mui/material";
import type { Product, ProductFormData } from "../types/Product";

const emptyForm: ProductFormData = {
  name: "",
  description: null,
  sku: "",
  barcode: null,
  price: 0,
  cost: 0,
  quantity: 0,
  category: null,
  isActive: true,
};

interface Props {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (data: ProductFormData) => void;
}

export default function ProductForm({ open, product, onClose, onSave }: Props) {
  const [form, setForm] = useState<ProductFormData>(
    product
      ? {
          name: product.name,
          description: product.description,
          sku: product.sku,
          barcode: product.barcode,
          price: product.price,
          cost: product.cost,
          quantity: product.quantity,
          category: product.category,
          isActive: product.isActive,
        }
      : { ...emptyForm },
  );

  const handleChange =
    (field: keyof ProductFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "price" || field === "cost"
          ? parseFloat(e.target.value) || 0
          : field === "quantity"
            ? parseInt(e.target.value) || 0
            : e.target.value || null;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{product ? "Edit Product" : "New Product"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Product Name"
              fullWidth
              required
              value={form.name}
              onChange={handleChange("name")}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="SKU"
              fullWidth
              required
              value={form.sku}
              onChange={handleChange("sku")}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="Barcode"
              fullWidth
              value={form.barcode ?? ""}
              onChange={handleChange("barcode")}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="Price"
              type="number"
              fullWidth
              required
              value={form.price}
              onChange={handleChange("price")}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="Cost"
              type="number"
              fullWidth
              value={form.cost}
              onChange={handleChange("cost")}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={form.quantity}
              onChange={handleChange("quantity")}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="Category"
              fullWidth
              value={form.category ?? ""}
              onChange={handleChange("category")}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={form.description ?? ""}
              onChange={handleChange("description")}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                />
              }
              label="Active"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!form.name || !form.sku}
        >
          {product ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

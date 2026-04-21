import { useState, useEffect, useRef } from "react";
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
  Box,
  Typography,
  Tooltip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import JsBarcode from "jsbarcode";
import type { Product, ProductFormData } from "../types/Product";
import type { Category } from "../types/Category";
import { fetchCategories } from "../api/categories";

const emptyForm: ProductFormData = {
  name: "",
  description: null,
  sku: "",
  barcode: null,
  price: 0,
  type: "item",
  quantity: 0,
  categoryId: null,
  subCategoryId: null,
  isActive: true,
};

function generateEAN13(): string {
  const digits = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 10),
  );
  const checksum =
    (10 -
      (digits.reduce((sum, d, i) => sum + d * (i % 2 === 0 ? 1 : 3), 0) % 10)) %
    10;
  return [...digits, checksum].join("");
}

function generateSKU(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const segment = (len: number) =>
    Array.from(
      { length: len },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
  return `SKU-${segment(4)}-${segment(4)}`;
}

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
          type: product.type,
          quantity: product.quantity,
          categoryId: product.categoryId,
          subCategoryId: product.subCategoryId,
          isActive: product.isActive,
        }
      : { ...emptyForm },
  );
  const svgRef = useRef<SVGSVGElement>(null);
  const [copied, setCopied] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Re-render barcode whenever the barcode value changes
  useEffect(() => {
    if (!form.barcode || !svgRef.current) return;
    try {
      JsBarcode(svgRef.current, form.barcode, {
        format: "EAN13",
        width: 2,
        height: 60,
        displayValue: true,
        fontSize: 12,
        margin: 8,
        background: "#ffffff",
        lineColor: "#111827",
      });
    } catch {
      // invalid barcode value — clear the svg
      svgRef.current.innerHTML = "";
    }
  }, [form.barcode]);

  // Reset form when dialog opens/closes & load categories
  useEffect(() => {
    if (open) {
      setForm(
        product
          ? {
              name: product.name,
              description: product.description,
              sku: product.sku,
              barcode: product.barcode,
              price: product.price,
              type: product.type,
              quantity: product.quantity,
              categoryId: product.categoryId,
              subCategoryId: product.subCategoryId,
              isActive: product.isActive,
            }
          : { ...emptyForm, sku: generateSKU() },
      );
      fetchCategories()
        .then(setCategories)
        .catch(() => setCategories([]));
    }
  }, [open, product]);

  const handleGenerateBarcode = () => {
    setForm((prev) => ({ ...prev, barcode: generateEAN13() }));
  };

  const handleCopyBarcode = () => {
    if (!form.barcode) return;
    navigator.clipboard.writeText(form.barcode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleChange =
    (field: keyof ProductFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "price"
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
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Generate SKU">
                        <IconButton
                          size="small"
                          onClick={() =>
                            setForm((prev) => ({ ...prev, sku: generateSKU() }))
                          }
                          edge="end"
                        >
                          <RefreshIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="Barcode"
              fullWidth
              value={form.barcode ?? ""}
              onChange={handleChange("barcode")}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Generate EAN-13">
                        <IconButton
                          size="small"
                          onClick={handleGenerateBarcode}
                          edge="end"
                        >
                          <RefreshIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          {form.barcode && (
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "8px",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "#fff",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Barcode Preview
                </Typography>
                <svg ref={svgRef} />
                <Tooltip title={copied ? "Copied!" : "Copy barcode number"}>
                  <Button
                    size="small"
                    startIcon={<ContentCopyIcon fontSize="small" />}
                    onClick={handleCopyBarcode}
                    sx={{ mt: 0.5 }}
                  >
                    {copied ? "Copied!" : form.barcode}
                  </Button>
                </Tooltip>
              </Box>
            </Grid>
          )}
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
                    <InputAdornment position="start">₱</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={form.type}
                label="Type"
                onChange={(e) => {
                  const val = e.target.value as "item" | "service";
                  setForm((prev) => ({
                    ...prev,
                    type: val,
                    quantity: val === "service" ? 0 : prev.quantity,
                  }));
                }}
              >
                <MenuItem value="item">Item</MenuItem>
                <MenuItem value="service">Service</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {form.type === "item" && (
            <Grid size={{ xs: 4 }}>
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                value={form.quantity}
                onChange={handleChange("quantity")}
              />
            </Grid>
          )}
          <Grid size={{ xs: form.type === "item" ? 4 : 6 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={form.categoryId ?? ""}
                label="Category"
                onChange={(e) => {
                  const val = e.target.value || null;
                  setForm((prev) => ({
                    ...prev,
                    categoryId: val,
                    subCategoryId: null,
                  }));
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {categories
                  .filter((c) => c.isActive)
                  .map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: form.type === "item" ? 4 : 6 }}>
            <FormControl fullWidth disabled={!form.categoryId}>
              <InputLabel>Sub-Category</InputLabel>
              <Select
                value={form.subCategoryId ?? ""}
                label="Sub-Category"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    subCategoryId: e.target.value || null,
                  }))
                }
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {(
                  categories
                    .find((c) => c.id === form.categoryId)
                    ?.subCategories?.filter((s) => s.isActive) ?? []
                ).map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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

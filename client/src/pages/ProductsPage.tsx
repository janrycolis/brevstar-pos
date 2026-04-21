import { useEffect, useState, useCallback } from "react";
import { Typography, Button, Box, Snackbar, Alert, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { Product, ProductFormData } from "../types/Product";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/products";
import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";
import CategoryManager from "../components/CategoryManager";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const loadProducts = useCallback(async () => {
    try {
      setProducts(await fetchProducts());
    } catch {
      showSnackbar("Failed to load products", "error");
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error") => {
      setSnackbar({ open: true, message, severity });
    },
    [],
  );

  const handleAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setFormOpen(true);
  };

  const handleDelete = async (product: Product) => {
    try {
      await deleteProduct(product.id);
      showSnackbar("Product deleted", "success");
      loadProducts();
    } catch {
      showSnackbar("Failed to delete product", "error");
    }
  };

  const handleSave = async (data: ProductFormData) => {
    try {
      if (editing) {
        await updateProduct(editing.id, data);
        showSnackbar("Product updated", "success");
      } else {
        await createProduct(data);
        showSnackbar("Product created", "success");
      }
      setFormOpen(false);
      loadProducts();
    } catch {
      showSnackbar("Failed to save product", "error");
    }
  };

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4">Inventory Tracking</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Manage and track your product inventory.
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
            {products.length} {products.length === 1 ? "product" : "products"}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Product
          </Button>
        </Box>
        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Paper>

      <Paper
        sx={{
          borderRadius: "14px",
          border: "1px solid rgba(0,0,0,0.06)",
          overflow: "hidden",
          bgcolor: "#fff",
          mt: 3,
        }}
      >
        <CategoryManager onSnackbar={showSnackbar} />
      </Paper>

      <ProductForm
        open={formOpen}
        product={editing}
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

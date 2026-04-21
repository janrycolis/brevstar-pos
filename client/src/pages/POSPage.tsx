import { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Chip,
  Divider,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { Product } from "../types/Product";
import type { Category } from "../types/Category";
import { fetchProducts } from "../api/products";
import { fetchCategories } from "../api/categories";
import { createTransaction } from "../api/transactions";

interface CartItem {
  product: Product;
  quantity: number;
}

const TAX_RATE = 0.12; // 12% VAT

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [amountTendered, setAmountTendered] = useState("");
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [lastChange, setLastChange] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const barcodeRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(async () => {
    try {
      const [prods, cats] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);
      setProducts(prods.filter((p) => p.isActive));
      setCategories(cats.filter((c) => c.isActive));
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to load products",
        severity: "error",
      });
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search));
    const matchesCategory =
      !selectedCategory || p.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Cart operations
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (product.type === "item" && existing.quantity >= product.quantity) {
          setSnackbar({
            open: true,
            message: `Only ${product.quantity} in stock`,
            severity: "error",
          });
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      if (product.type === "item" && product.quantity < 1) {
        setSnackbar({
          open: true,
          message: "Out of stock",
          severity: "error",
        });
        return prev;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id !== productId) return item;
          const newQty = item.quantity + delta;
          if (
            delta > 0 &&
            item.product.type === "item" &&
            newQty > item.product.quantity
          ) {
            setSnackbar({
              open: true,
              message: `Only ${item.product.quantity} in stock`,
              severity: "error",
            });
            return item;
          }
          return { ...item, quantity: newQty };
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Totals
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  // Barcode scan handler
  const handleBarcodeScan = (value: string) => {
    const found = products.find((p) => p.barcode === value || p.sku === value);
    if (found) {
      addToCart(found);
      setSearch("");
    } else {
      setSnackbar({
        open: true,
        message: "Product not found",
        severity: "error",
      });
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && search.trim()) {
      handleBarcodeScan(search.trim());
    }
  };

  // Checkout
  const handleCheckout = () => {
    if (cart.length === 0) return;
    setAmountTendered("");
    setCheckoutOpen(true);
  };

  const tenderedNum = parseFloat(amountTendered) || 0;
  const change = tenderedNum - total;

  const handleCompleteTransaction = async () => {
    if (tenderedNum < total) return;
    try {
      await createTransaction({
        subtotal,
        tax,
        total,
        amountTendered: tenderedNum,
        change,
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          unitPrice: Number(item.product.price),
          quantity: item.quantity,
          lineTotal: Number(item.product.price) * item.quantity,
        })),
      });
      setLastChange(change);
      setCheckoutOpen(false);
      setReceiptOpen(true);
      clearCart();
      // Reload products to reflect updated stock
      loadData();
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err instanceof Error ? err.message : "Failed to complete transaction",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 2, height: "calc(100vh - 48px)" }}>
      {/* Left Panel — Product Grid */}
      <Box
        sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}
      >
        {/* Search + Barcode */}
        <Paper
          sx={{
            borderRadius: "14px",
            border: "1px solid rgba(0,0,0,0.06)",
            p: 2,
            mb: 2,
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search products or scan barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            inputRef={barcodeRef}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <QrCodeScannerIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Category filter chips */}
          <Box sx={{ display: "flex", gap: 0.75, mt: 1.5, flexWrap: "wrap" }}>
            <Chip
              label="All"
              size="small"
              variant={selectedCategory === null ? "filled" : "outlined"}
              color={selectedCategory === null ? "primary" : "default"}
              onClick={() => setSelectedCategory(null)}
            />
            {categories.map((cat) => (
              <Chip
                key={cat.id}
                label={cat.name}
                size="small"
                variant={selectedCategory === cat.id ? "filled" : "outlined"}
                color={selectedCategory === cat.id ? "primary" : "default"}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.id ? null : cat.id,
                  )
                }
              />
            ))}
          </Box>
        </Paper>

        {/* Product grid */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 1.5,
            alignContent: "start",
            pb: 1,
          }}
        >
          {filteredProducts.length === 0 ? (
            <Box
              sx={{
                gridColumn: "1 / -1",
                textAlign: "center",
                py: 6,
              }}
            >
              <Typography variant="body2" color="text.disabled">
                No products found
              </Typography>
            </Box>
          ) : (
            filteredProducts.map((product) => {
              const inCart = cart.find((i) => i.product.id === product.id);
              const outOfStock =
                product.type === "item" && product.quantity < 1;
              return (
                <Paper
                  key={product.id}
                  elevation={0}
                  onClick={() => !outOfStock && addToCart(product)}
                  sx={{
                    borderRadius: "12px",
                    border: inCart
                      ? "2px solid #7c3aed"
                      : "1px solid rgba(0,0,0,0.06)",
                    p: 1.5,
                    cursor: outOfStock ? "not-allowed" : "pointer",
                    opacity: outOfStock ? 0.5 : 1,
                    transition: "all 0.15s",
                    position: "relative",
                    userSelect: "none",
                    "&:hover": outOfStock
                      ? {}
                      : {
                          borderColor: "#7c3aed",
                          bgcolor: "#f5f3ff",
                        },
                    "&:active": outOfStock
                      ? {}
                      : {
                          transform: "scale(0.97)",
                          bgcolor: "#ede9fe",
                        },
                  }}
                >
                  {inCart && (
                    <Chip
                      label={inCart.quantity}
                      size="small"
                      color="primary"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        height: 22,
                        minWidth: 22,
                        fontWeight: 700,
                        fontSize: "0.7rem",
                      }}
                    />
                  )}
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    noWrap
                    sx={{ mb: 0.5 }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    display="block"
                  >
                    {product.sku}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color="primary"
                    >
                      ₱{Number(product.price).toFixed(2)}
                    </Typography>
                    {product.type === "item" && (
                      <Typography variant="caption" color="text.disabled">
                        {product.quantity} left
                      </Typography>
                    )}
                  </Box>
                </Paper>
              );
            })
          )}
        </Box>
      </Box>

      {/* Right Panel — Cart */}
      <Paper
        sx={{
          width: 360,
          flexShrink: 0,
          borderRadius: "14px",
          border: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Cart header */}
        <Box
          sx={{
            px: 2.5,
            py: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ShoppingCartIcon fontSize="small" color="primary" />
            <Typography variant="subtitle1" fontWeight={700}>
              Cart
            </Typography>
            {cart.length > 0 && (
              <Chip
                label={cart.reduce((s, i) => s + i.quantity, 0)}
                size="small"
                color="primary"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
            )}
          </Box>
          {cart.length > 0 && (
            <Button size="small" color="error" onClick={clearCart}>
              Clear
            </Button>
          )}
        </Box>

        {/* Cart items */}
        <Box sx={{ flex: 1, overflow: "auto", px: 2, py: 1 }}>
          {cart.length === 0 ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" color="text.disabled">
                Cart is empty
              </Typography>
            </Box>
          ) : (
            cart.map((item) => (
              <Box
                key={item.product.id}
                sx={{
                  py: 1.5,
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    noWrap
                    sx={{ flex: 1, mr: 1 }}
                  >
                    {item.product.name}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    ₱{(Number(item.product.price) * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="caption" color="text.disabled">
                    ₱{Number(item.product.price).toFixed(2)} each
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => updateCartQuantity(item.product.id, -1)}
                      sx={{ width: 28, height: 28 }}
                    >
                      <RemoveIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ minWidth: 24, textAlign: "center" }}
                    >
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => updateCartQuantity(item.product.id, 1)}
                      sx={{ width: 28, height: 28 }}
                    >
                      <AddIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeFromCart(item.product.id)}
                      sx={{ width: 28, height: 28, ml: 0.5 }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))
          )}
        </Box>

        {/* Cart totals + checkout */}
        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderTop: "1px solid rgba(0,0,0,0.06)",
            bgcolor: "#fafafa",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 0.5,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Subtotal
            </Typography>
            <Typography variant="body2">₱{subtotal.toFixed(2)}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              VAT (12%)
            </Typography>
            <Typography variant="body2">₱{tax.toFixed(2)}</Typography>
          </Box>
          <Divider sx={{ mb: 1 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              Total
            </Typography>
            <Typography variant="subtitle1" fontWeight={700} color="primary">
              ₱{total.toFixed(2)}
            </Typography>
          </Box>
          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={cart.length === 0}
            onClick={handleCheckout}
            sx={{ fontWeight: 700, py: 1.25 }}
          >
            Charge ₱{total.toFixed(2)}
          </Button>
        </Box>
      </Paper>

      {/* Checkout Dialog */}
      <Dialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Payment</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: "16px !important",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              bgcolor: "#f5f3ff",
              borderRadius: "12px",
              py: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Total Due
            </Typography>
            <Typography variant="h4" fontWeight={700} color="primary">
              ₱{total.toFixed(2)}
            </Typography>
          </Box>
          <TextField
            label="Amount Tendered"
            type="number"
            fullWidth
            autoFocus
            value={amountTendered}
            onChange={(e) => setAmountTendered(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && tenderedNum >= total) {
                handleCompleteTransaction();
              }
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">₱</InputAdornment>
                ),
              },
            }}
          />
          {tenderedNum > 0 && (
            <Box
              sx={{
                textAlign: "center",
                bgcolor: tenderedNum >= total ? "#d1fae5" : "#fee2e2",
                borderRadius: "12px",
                py: 1.5,
              }}
            >
              <Typography
                variant="body2"
                color={tenderedNum >= total ? "success.main" : "error.main"}
              >
                {tenderedNum >= total ? "Change" : "Insufficient"}
              </Typography>
              <Typography
                variant="h5"
                fontWeight={700}
                color={tenderedNum >= total ? "success.main" : "error.main"}
              >
                ₱{Math.abs(change).toFixed(2)}
              </Typography>
            </Box>
          )}
          {/* Quick tender buttons */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {[
              Math.ceil(total),
              Math.ceil(total / 50) * 50,
              Math.ceil(total / 100) * 100,
              Math.ceil(total / 500) * 500,
              1000,
            ]
              .filter((v, i, arr) => v >= total && arr.indexOf(v) === i)
              .slice(0, 4)
              .map((amount) => (
                <Button
                  key={amount}
                  variant="outlined"
                  size="small"
                  sx={{ flex: 1 }}
                  onClick={() => setAmountTendered(String(amount))}
                >
                  ₱{amount.toLocaleString()}
                </Button>
              ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckoutOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCompleteTransaction}
            disabled={tenderedNum < total}
          >
            Complete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Receipt / Success Dialog */}
      <Dialog
        open={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent sx={{ textAlign: "center", py: 4 }}>
          <CheckCircleIcon
            sx={{ fontSize: 64, color: "success.main", mb: 2 }}
          />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Payment Complete
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Change: ₱{lastChange.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => {
              setReceiptOpen(false);
              barcodeRef.current?.focus();
            }}
          >
            New Transaction
          </Button>
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
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

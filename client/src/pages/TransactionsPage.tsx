import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import type { Transaction } from "../types/Transaction";
import { fetchTransactions } from "../api/transactions";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const loadTransactions = useCallback(async () => {
    try {
      setTransactions(await fetchTransactions());
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to load transactions",
        severity: "error",
      });
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const filtered = transactions.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.receiptNumber.toLowerCase().includes(q) ||
      (t.cashier &&
        `${t.cashier.firstName} ${t.cashier.lastName}`
          .toLowerCase()
          .includes(q)) ||
      t.items.some((i) => i.productName.toLowerCase().includes(q))
    );
  });

  const handleView = (txn: Transaction) => {
    setSelected(txn);
    setDetailOpen(true);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4">Transactions</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          View order history and transaction details.
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
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {filtered.length}{" "}
            {filtered.length === 1 ? "transaction" : "transactions"}
          </Typography>
          <TextField
            size="small"
            placeholder="Search receipt, cashier, product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 300 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Receipt #</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Cashier</TableCell>
                <TableCell align="center">Items</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Tendered</TableCell>
                <TableCell align="right">Change</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.disabled">
                      No transactions found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((txn) => (
                <TableRow key={txn.id} hover>
                  <TableCell>
                    <Chip
                      icon={
                        <ReceiptLongIcon sx={{ fontSize: "14px !important" }} />
                      }
                      label={txn.receiptNumber}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {formatDate(txn.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {txn.cashier
                      ? `${txn.cashier.firstName} ${txn.cashier.lastName}`
                      : "—"}
                  </TableCell>
                  <TableCell align="center">
                    {txn.items.reduce((s, i) => s + i.quantity, 0)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    ₱{Number(txn.total).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    ₱{Number(txn.amountTendered).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    ₱{Number(txn.change).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleView(txn)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Transaction Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selected && (
          <>
            <DialogTitle>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  {selected.receiptNumber}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(selected.createdAt)}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Cashier:{" "}
                {selected.cashier
                  ? `${selected.cashier.firstName} ${selected.cashier.lastName}`
                  : "—"}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Line items */}
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Qty</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selected.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell align="right">
                        ₱{Number(item.unitPrice).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">
                        ₱{Number(item.lineTotal).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Divider sx={{ my: 2 }} />

              {/* Totals */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal
                  </Typography>
                  <Typography variant="body2">
                    ₱{Number(selected.subtotal).toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    VAT (12%)
                  </Typography>
                  <Typography variant="body2">
                    ₱{Number(selected.tax).toFixed(2)}
                  </Typography>
                </Box>
                <Divider sx={{ my: 0.5 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Total
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    color="primary"
                  >
                    ₱{Number(selected.total).toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Amount Tendered
                  </Typography>
                  <Typography variant="body2">
                    ₱{Number(selected.amountTendered).toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Change
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    ₱{Number(selected.change).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

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

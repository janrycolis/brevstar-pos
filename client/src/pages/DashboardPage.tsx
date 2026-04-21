import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid2 as Grid,
  Card,
  CardContent,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CategoryIcon from "@mui/icons-material/Category";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { fetchProducts } from "../api/products";
import { fetchStaffList } from "../api/staff";
import { fetchCategories } from "../api/categories";
import { fetchTransactions } from "../api/transactions";
import type { Transaction } from "../types/Transaction";

interface Stats {
  totalProducts: number;
  activeProducts: number;
  totalStaff: number;
  totalCategories: number;
}

type Period = "daily" | "weekly" | "monthly";

interface ChartPoint {
  label: string;
  sales: number;
  orders: number;
}

function aggregateSales(
  transactions: Transaction[],
  period: Period,
): ChartPoint[] {
  const now = new Date();
  const map = new Map<string, { sales: number; orders: number }>();

  if (period === "daily") {
    // Last 14 days
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      map.set(key, { sales: 0, orders: 0 });
    }
  } else if (period === "weekly") {
    // Last 8 weeks
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().slice(0, 10);
      map.set(key, { sales: 0, orders: 0 });
    }
  } else {
    // Last 12 months
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map.set(key, { sales: 0, orders: 0 });
    }
  }

  for (const txn of transactions) {
    const d = new Date(txn.createdAt);
    let key: string;
    if (period === "daily") {
      key = d.toISOString().slice(0, 10);
    } else if (period === "weekly") {
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      key = weekStart.toISOString().slice(0, 10);
    } else {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    }
    const entry = map.get(key);
    if (entry) {
      entry.sales += Number(txn.total);
      entry.orders += 1;
    }
  }

  return Array.from(map.entries()).map(([key, val]) => {
    let label: string;
    if (period === "daily") {
      const d = new Date(key + "T00:00:00");
      label = d.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
    } else if (period === "weekly") {
      const d = new Date(key + "T00:00:00");
      label = `Wk ${d.toLocaleDateString("en-PH", { month: "short", day: "numeric" })}`;
    } else {
      const [y, m] = key.split("-");
      const d = new Date(Number(y), Number(m) - 1, 1);
      label = d.toLocaleDateString("en-PH", {
        month: "short",
        year: "2-digit",
      });
    }
    return {
      label,
      sales: Math.round(val.sales * 100) / 100,
      orders: val.orders,
    };
  });
}

export default function DashboardPage() {
  const { staff } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    activeProducts: 0,
    totalStaff: 0,
    totalCategories: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [period, setPeriod] = useState<Period>("daily");

  useEffect(() => {
    Promise.all([
      fetchProducts().catch(() => []),
      staff?.role === "admin"
        ? fetchStaffList().catch(() => [])
        : Promise.resolve([]),
      fetchCategories().catch(() => []),
      fetchTransactions().catch(() => []),
    ]).then(([products, staffList, categories, txns]) => {
      setStats({
        totalProducts: products.length,
        activeProducts: products.filter((p) => p.isActive).length,
        totalStaff: staffList.length,
        totalCategories: categories.length,
      });
      setTransactions(txns);
    });
  }, [staff?.role]);

  const chartData = aggregateSales(transactions, period);
  const totalSales = transactions.reduce((sum, t) => sum + Number(t.total), 0);
  const totalOrders = transactions.length;

  const cards = [
    {
      label: "TOTAL PRODUCTS",
      value: stats.totalProducts,
      description: "products in inventory",
      icon: <InventoryIcon sx={{ fontSize: 20, color: "#10b981" }} />,
      iconBg: "#d1fae5",
    },
    {
      label: "ACTIVE PRODUCTS",
      value: stats.activeProducts,
      description: "available for sale",
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 20, color: "#7c3aed" }} />,
      iconBg: "#ede9fe",
    },
    {
      label: "INACTIVE PRODUCTS",
      value: stats.totalProducts - stats.activeProducts,
      description: "not available for sale",
      icon: <AttachMoneyIcon sx={{ fontSize: 20, color: "#ef4444" }} />,
      iconBg: "#fee2e2",
    },
    {
      label: "CATEGORIES",
      value: stats.totalCategories,
      description: "product categories",
      icon: <CategoryIcon sx={{ fontSize: 20, color: "#0ea5e9" }} />,
      iconBg: "#e0f2fe",
    },
    ...(staff?.role === "admin"
      ? [
          {
            label: "EMPLOYEES",
            value: stats.totalStaff,
            description: "active team members",
            icon: <PeopleIcon sx={{ fontSize: 20, color: "#f59e0b" }} />,
            iconBg: "#fef3c7",
          },
        ]
      : []),
  ];

  return (
    <Box>
      <Typography variant="h4" mb={0.5}>
        Overview
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Platform-wide summary.
      </Typography>

      <Grid container spacing={2.5}>
        {cards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.label}>
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mb={2.5}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      fontSize: "0.68rem",
                    }}
                  >
                    {card.label}
                  </Typography>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "10px",
                      bgcolor: card.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{ fontSize: "2rem", color: "text.primary", mb: 0.5 }}
                >
                  {card.value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", fontSize: "0.78rem" }}
                >
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sales Graph */}
      <Paper
        sx={{
          mt: 3,
          borderRadius: "14px",
          border: "1px solid rgba(0,0,0,0.06)",
          overflow: "hidden",
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
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              Sales Overview
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ₱
              {totalSales.toLocaleString("en-PH", { minimumFractionDigits: 2 })}{" "}
              total
              {" · "}
              {totalOrders} {totalOrders === 1 ? "order" : "orders"}
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={period}
            exclusive
            onChange={(_e, val) => val && setPeriod(val)}
            size="small"
          >
            <ToggleButton value="daily">Daily</ToggleButton>
            <ToggleButton value="weekly">Weekly</ToggleButton>
            <ToggleButton value="monthly">Monthly</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box sx={{ px: 2, py: 3 }}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis
                dataKey="label"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6b7280" }}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6b7280" }}
                tickFormatter={(v: number) =>
                  v >= 1000 ? `₱${(v / 1000).toFixed(0)}k` : `₱${v}`
                }
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  fontSize: 13,
                }}
                formatter={(value) => [
                  `₱${Number(value).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
                  "Sales",
                ]}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#7c3aed"
                strokeWidth={2.5}
                fill="url(#salesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
}

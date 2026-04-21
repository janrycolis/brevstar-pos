import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid2 as Grid,
  Card,
  CardContent,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useAuth } from "../context/AuthContext";
import { fetchProducts } from "../api/products";
import { fetchStaffList } from "../api/staff";

interface Stats {
  totalProducts: number;
  activeProducts: number;
  totalStaff: number;
}

export default function DashboardPage() {
  const { staff } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    activeProducts: 0,
    totalStaff: 0,
  });

  useEffect(() => {
    Promise.all([
      fetchProducts().catch(() => []),
      staff?.role === "admin"
        ? fetchStaffList().catch(() => [])
        : Promise.resolve([]),
    ]).then(([products, staffList]) => {
      setStats({
        totalProducts: products.length,
        activeProducts: products.filter((p) => p.isActive).length,
        totalStaff: staffList.length,
      });
    });
  }, [staff?.role]);

  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <InventoryIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      color: "#e3f2fd",
    },
    {
      title: "Active Products",
      value: stats.activeProducts,
      icon: <AttachMoneyIcon sx={{ fontSize: 40, color: "success.main" }} />,
      color: "#e8f5e9",
    },
    ...(staff?.role === "admin"
      ? [
          {
            title: "Staff Members",
            value: stats.totalStaff,
            icon: <PeopleIcon sx={{ fontSize: 40, color: "secondary.main" }} />,
            color: "#fff3e0",
          },
        ]
      : []),
  ];

  return (
    <Box>
      <Typography variant="h4" mb={1}>
        Welcome back, {staff?.firstName}
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Here's an overview of your store.
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.title}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: 4 },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      {card.title}
                    </Typography>
                    <Typography variant="h3" fontWeight={700}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 3,
                      bgcolor: card.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

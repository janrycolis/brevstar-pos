import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useAuth } from "../context/AuthContext";

const DRAWER_WIDTH = 220;

const navItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: <DashboardIcon fontSize="small" />,
    adminOnly: true,
  },
  {
    label: "Inventory Tracking",
    path: "/products",
    icon: <InventoryIcon fontSize="small" />,
    adminOnly: true,
  },
  {
    label: "Employee Management",
    path: "/staff",
    icon: <PeopleIcon fontSize="small" />,
    adminOnly: true,
  },
  {
    label: "Point of Sale",
    path: "/pos",
    icon: <PointOfSaleIcon fontSize="small" />,
    roles: ["cashier", "manager"] as string[],
  },
  {
    label: "Transactions",
    path: "/transactions",
    icon: <ReceiptLongIcon fontSize="small" />,
    roles: ["admin", "manager"] as string[],
  },
];

export default function Layout() {
  const { staff, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: "#1a0f3c",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 30,
              bgcolor: "#7c3aed",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <PointOfSaleIcon sx={{ fontSize: 16, color: "#fff" }} />
          </Box>
          <Typography
            fontWeight={700}
            noWrap
            sx={{ fontSize: "0.95rem", color: "#fff" }}
          >
            Brevstar POS
          </Typography>
        </Box>

        <List sx={{ px: 1.5, mt: 0.5, flex: 1 }}>
          {navItems
            .filter(
              (item) =>
                (!item.adminOnly || staff?.role === "admin") &&
                (!item.roles || item.roles.includes(staff?.role ?? "")),
            )
            .map((item) => (
              <ListItemButton
                key={item.path}
                onClick={() => navigate(item.path)}
                selected={isActive(item.path)}
                sx={{
                  borderRadius: "10px",
                  mb: 0.5,
                  py: 1,
                  color: "rgba(255,255,255,0.5)",
                  "&.Mui-selected": {
                    bgcolor: "rgba(255,255,255,0.12)",
                    color: "#fff",
                    "& .MuiListItemIcon-root": { color: "#fff" },
                  },
                  "&.Mui-selected:hover": {
                    bgcolor: "rgba(255,255,255,0.15)",
                  },
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.07)",
                    color: "#fff",
                    "& .MuiListItemIcon-root": { color: "#fff" },
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: isActive(item.path) ? 600 : 400,
                  }}
                />
              </ListItemButton>
            ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        {/* Bottom user row */}
        <Box sx={{ px: 1.5, pb: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 1,
              borderRadius: "10px",
              bgcolor: "rgba(255,255,255,0.06)",
            }}
          >
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: "#7c3aed",
                fontSize: 11,
                fontWeight: 700,
                borderRadius: "6px",
                flexShrink: 0,
              }}
            >
              {staff?.firstName?.[0]}
              {staff?.lastName?.[0]}
            </Avatar>
            <Typography
              variant="caption"
              noWrap
              sx={{ color: "rgba(255,255,255,0.6)", flex: 1 }}
            >
              {staff?.email}
            </Typography>
            <Tooltip title="Logout">
              <IconButton
                size="small"
                onClick={logout}
                sx={{ color: "rgba(255,255,255,0.5)", p: 0.5 }}
              >
                <LogoutIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          minHeight: "100vh",
          p: 4,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

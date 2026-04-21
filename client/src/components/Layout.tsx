import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Avatar,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { useAuth } from "../context/AuthContext";

const DRAWER_WIDTH = 240;

const navItems = [
  { label: "Dashboard", path: "/", icon: <DashboardIcon /> },
  { label: "Products", path: "/products", icon: <InventoryIcon /> },
  {
    label: "Staff",
    path: "/staff",
    icon: <PeopleIcon />,
    adminOnly: true,
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
            bgcolor: "#1a237e",
            color: "#fff",
          },
        }}
      >
        <Toolbar
          sx={{
            gap: 1,
            px: 2,
          }}
        >
          <PointOfSaleIcon sx={{ fontSize: 28 }} />
          <Typography variant="h6" noWrap fontWeight={700}>
            Brevstar POS
          </Typography>
        </Toolbar>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

        <List sx={{ px: 1, mt: 1 }}>
          {navItems
            .filter((item) => !item.adminOnly || staff?.role === "admin")
            .map((item) => (
              <ListItemButton
                key={item.path}
                onClick={() => navigate(item.path)}
                selected={isActive(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  color: "rgba(255,255,255,0.7)",
                  "&.Mui-selected": {
                    bgcolor: "rgba(255,255,255,0.12)",
                    color: "#fff",
                    "& .MuiListItemIcon-root": { color: "#fff" },
                  },
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{ color: "rgba(255,255,255,0.7)", minWidth: 40 }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        {/* Staff info at bottom */}
        <Box sx={{ p: 2 }}>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", mb: 2 }} />
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#f57c00",
                fontSize: 14,
              }}
            >
              {staff?.firstName?.[0]}
              {staff?.lastName?.[0]}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="body2"
                noWrap
                sx={{ color: "#fff", fontWeight: 600 }}
              >
                {staff?.firstName} {staff?.lastName}
              </Typography>
              <Typography
                variant="caption"
                noWrap
                sx={{
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "capitalize",
                }}
              >
                {staff?.role}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "#fff",
            color: "text.primary",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Toolbar sx={{ justifyContent: "flex-end" }}>
            <Tooltip title="Logout">
              <IconButton onClick={logout} color="inherit">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3, flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

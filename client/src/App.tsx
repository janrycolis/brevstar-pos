import { Routes, Route, Navigate } from "react-router-dom";
import {
  CssBaseline,
  ThemeProvider,
  CircularProgress,
  Box,
} from "@mui/material";
import { theme } from "./theme";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import StaffPage from "./pages/StaffPage";
import POSPage from "./pages/POSPage";
import TransactionsPage from "./pages/TransactionsPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { staff, loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!staff) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { staff } = useAuth();
  if (staff?.role !== "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
}

function NonCashierRoute({ children }: { children: React.ReactNode }) {
  const { staff } = useAuth();
  if (staff?.role === "cashier") return <Navigate to="/pos" replace />;
  return <>{children}</>;
}

function NonAdminRoute({ children }: { children: React.ReactNode }) {
  const { staff } = useAuth();
  if (staff?.role === "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { staff, loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          staff ? (
            <Navigate to={staff.role === "admin" ? "/" : "/pos"} replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/"
          element={
            <AdminRoute>
              <DashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/products"
          element={
            <AdminRoute>
              <ProductsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <AdminRoute>
              <StaffPage />
            </AdminRoute>
          }
        />
        <Route
          path="/pos"
          element={
            <NonAdminRoute>
              <POSPage />
            </NonAdminRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <NonCashierRoute>
              <TransactionsPage />
            </NonCashierRoute>
          }
        />
      </Route>
      <Route
        path="*"
        element={
          <Navigate to={staff?.role === "admin" ? "/" : "/pos"} replace />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

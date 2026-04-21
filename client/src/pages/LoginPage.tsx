import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  "Real-time inventory tracking",
  "Role-based employee access",
  "Secure, fast authentication",
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      {/* ── Left brand panel ─────────────────────────────────────── */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          bgcolor: "#1a0f3c",
          p: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Soft glow top-left */}
        <Box
          sx={{
            position: "absolute",
            top: -140,
            left: -140,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        {/* Soft glow bottom-right */}
        <Box
          sx={{
            position: "absolute",
            bottom: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#7c3aed",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <PointOfSaleIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} sx={{ color: "#fff" }}>
            Brevstar POS
          </Typography>
        </Box>

        {/* Headline */}
        <Box>
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{ color: "#fff", lineHeight: 1.2, mb: 2 }}
          >
            Manage your store
            <br />
            with confidence.
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "rgba(255,255,255,0.45)", maxWidth: 340 }}
          >
            From inventory to employees, Brevstar gives you everything you need
            to run your point of sale smoothly.
          </Typography>
        </Box>

        {/* Feature list */}
        <Box>
          {FEATURES.map((feat) => (
            <Box
              key={feat}
              display="flex"
              alignItems="center"
              gap={1.5}
              mb={1.5}
            >
              <CheckCircleOutlineIcon
                sx={{ color: "#a78bfa", fontSize: 18, flexShrink: 0 }}
              />
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.5)" }}
              >
                {feat}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Right form panel ─────────────────────────────────────── */}
      <Box
        sx={{
          flex: { xs: 1, md: "0 0 480px" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "background.default",
          p: { xs: 4, md: 6 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 360 }}>
          {/* Mobile logo */}
          <Box
            display={{ xs: "flex", md: "none" }}
            alignItems="center"
            gap={1}
            mb={4}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#7c3aed",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PointOfSaleIcon sx={{ color: "#fff", fontSize: 18 }} />
            </Box>
            <Typography variant="h6" fontWeight={700}>
              Brevstar POS
            </Typography>
          </Box>

          <Typography variant="h5" fontWeight={700} mb={0.5}>
            Sign in
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Welcome back — enter your credentials to continue.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Email */}
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                display: "block",
                mb: 0.75,
              }}
            >
              Email address
            </Typography>
            <TextField
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              placeholder="you@example.com"
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon
                      sx={{ color: "text.disabled", fontSize: 18 }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password */}
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                display: "block",
                mb: 0.75,
              }}
            >
              Password
            </Typography>
            <TextField
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon
                      sx={{ color: "text.disabled", fontSize: 18 }}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      size="small"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <VisibilityOff
                          sx={{ color: "text.disabled", fontSize: 18 }}
                        />
                      ) : (
                        <Visibility
                          sx={{ color: "text.disabled", fontSize: 18 }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              endIcon={!loading && <ArrowForwardIcon />}
              sx={{ py: 1.5 }}
            >
              {loading ? "Signing in…" : "Continue"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

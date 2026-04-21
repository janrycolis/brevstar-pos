import { IRouter, Router } from "express";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../data-source.js";
import { Staff } from "../entities/Staff.js";
import { signToken, requireAuth } from "../middleware/auth.js";

export const router: IRouter = Router();
const repo = () => AppDataSource.getRepository(Staff);

function sanitize(staff: Staff) {
  const { passwordHash: _, ...safe } = staff;
  return safe;
}

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const staff = await repo().findOneBy({ email });
  if (!staff) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  if (!staff.isActive) {
    res.status(401).json({ error: "Account is inactive" });
    return;
  }

  const valid = await bcrypt.compare(password, staff.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = signToken(staff);
  res.json({ token, staff: sanitize(staff) });
});

// Get current user
router.get("/me", requireAuth, (req, res) => {
  res.json(sanitize(req.staff!));
});

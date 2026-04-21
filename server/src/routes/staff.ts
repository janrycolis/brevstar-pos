import { Router } from "express";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../data-source.js";
import { Staff } from "../entities/Staff.js";

export const router = Router();
const repo = () => AppDataSource.getRepository(Staff);

function sanitize(staff: Staff) {
  const { passwordHash: _, ...safe } = staff;
  return safe;
}

// List all staff
router.get("/", async (_req, res) => {
  const staff = await repo().find({ order: { firstName: "ASC" } });
  res.json(staff.map(sanitize));
});

// Get single staff
router.get("/:id", async (req, res) => {
  const staff = await repo().findOneBy({ id: req.params.id });
  if (!staff) {
    res.status(404).json({ error: "Staff not found" });
    return;
  }
  res.json(sanitize(staff));
});

// Create staff
router.post("/", async (req, res) => {
  const { password, ...rest } = req.body;

  if (!password) {
    res.status(400).json({ error: "Password is required" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const staff = repo().create({ ...rest, passwordHash });
  const saved = await repo().save(staff);
  res.status(201).json(sanitize(saved));
});

// Update staff
router.put("/:id", async (req, res) => {
  const staff = await repo().findOneBy({ id: req.params.id });
  if (!staff) {
    res.status(404).json({ error: "Staff not found" });
    return;
  }

  const { password, ...rest } = req.body;
  repo().merge(staff, rest);

  if (password) {
    staff.passwordHash = await bcrypt.hash(password, 10);
  }

  const updated = await repo().save(staff);
  res.json(sanitize(updated));
});

// Delete staff
router.delete("/:id", async (req, res) => {
  const result = await repo().delete(req.params.id);
  if (result.affected === 0) {
    res.status(404).json({ error: "Staff not found" });
    return;
  }
  res.status(204).send();
});

import { Router } from "express";
import type { Router as ExpressRouter } from "express";

export const router: ExpressRouter = Router();

router.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

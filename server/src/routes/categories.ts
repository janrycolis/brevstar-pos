import { Router, type IRouter } from "express";
import { AppDataSource } from "../data-source.js";
import { Category } from "../entities/Category.js";
import { SubCategory } from "../entities/SubCategory.js";

export const router: IRouter = Router();
const catRepo = () => AppDataSource.getRepository(Category);
const subRepo = () => AppDataSource.getRepository(SubCategory);

// ── Categories ──────────────────────────────────────────────

// List all categories (with sub-categories)
router.get("/", async (_req, res) => {
  const categories = await catRepo().find({
    relations: ["subCategories"],
    order: { name: "ASC" },
  });
  res.json(categories);
});

// Get single category
router.get("/:id", async (req, res) => {
  const category = await catRepo().findOne({
    where: { id: req.params.id },
    relations: ["subCategories"],
  });
  if (!category) {
    res.status(404).json({ error: "Category not found" });
    return;
  }
  res.json(category);
});

// Create category
router.post("/", async (req, res) => {
  const category = catRepo().create(req.body);
  const saved = await catRepo().save(category);
  res.status(201).json(saved);
});

// Update category
router.put("/:id", async (req, res) => {
  const category = await catRepo().findOneBy({ id: req.params.id });
  if (!category) {
    res.status(404).json({ error: "Category not found" });
    return;
  }
  catRepo().merge(category, req.body);
  const updated = await catRepo().save(category);
  res.json(updated);
});

// Delete category (cascades to sub-categories)
router.delete("/:id", async (req, res) => {
  const result = await catRepo().delete(req.params.id);
  if (result.affected === 0) {
    res.status(404).json({ error: "Category not found" });
    return;
  }
  res.json({ deleted: true });
});

// ── Sub-Categories ──────────────────────────────────────────

// Create sub-category under a category
router.post("/:id/sub-categories", async (req, res) => {
  const category = await catRepo().findOneBy({ id: req.params.id });
  if (!category) {
    res.status(404).json({ error: "Category not found" });
    return;
  }
  const sub = subRepo().create({ ...req.body, categoryId: category.id });
  const saved = await subRepo().save(sub);
  res.status(201).json(saved);
});

// Update sub-category
router.put("/:categoryId/sub-categories/:subId", async (req, res) => {
  const sub = await subRepo().findOneBy({
    id: req.params.subId,
    categoryId: req.params.categoryId,
  });
  if (!sub) {
    res.status(404).json({ error: "Sub-category not found" });
    return;
  }
  subRepo().merge(sub, req.body);
  const updated = await subRepo().save(sub);
  res.json(updated);
});

// Delete sub-category
router.delete("/:categoryId/sub-categories/:subId", async (req, res) => {
  const result = await subRepo().delete({
    id: req.params.subId,
    categoryId: req.params.categoryId,
  });
  if (result.affected === 0) {
    res.status(404).json({ error: "Sub-category not found" });
    return;
  }
  res.json({ deleted: true });
});

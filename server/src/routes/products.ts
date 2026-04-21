import { Router, type IRouter } from "express";
import { AppDataSource } from "../data-source.js";
import { Product } from "../entities/Product.js";

export const router: IRouter = Router();
const repo = () => AppDataSource.getRepository(Product);

// List all products
router.get("/", async (_req, res) => {
  const products = await repo().find({
    relations: ["category", "subCategory"],
    order: { name: "ASC" },
  });
  res.json(products);
});

// Get single product
router.get("/:id", async (req, res) => {
  const product = await repo().findOne({
    where: { id: req.params.id },
    relations: ["category", "subCategory"],
  });
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});

// Create product
router.post("/", async (req, res) => {
  const product = repo().create(req.body);
  const saved = await repo().save(product);
  res.status(201).json(saved);
});

// Update product
router.put("/:id", async (req, res) => {
  const product = await repo().findOneBy({ id: req.params.id });
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  repo().merge(product, req.body);
  const updated = await repo().save(product);
  res.json(updated);
});

// Delete product
router.delete("/:id", async (req, res) => {
  const result = await repo().delete(req.params.id);
  if (result.affected === 0) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.status(204).send();
});

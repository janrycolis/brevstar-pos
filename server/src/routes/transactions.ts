import { Router, type IRouter } from "express";
import { AppDataSource } from "../data-source.js";
import { Transaction } from "../entities/Transaction.js";
import { Product } from "../entities/Product.js";

export const router: IRouter = Router();
const repo = () => AppDataSource.getRepository(Transaction);
const productRepo = () => AppDataSource.getRepository(Product);

// List transactions (newest first)
router.get("/", async (_req, res) => {
  const transactions = await repo().find({
    relations: ["cashier", "items"],
    order: { createdAt: "DESC" },
  });
  // Strip passwordHash from cashier
  const result = transactions.map((t) => ({
    ...t,
    cashier: t.cashier
      ? {
          id: t.cashier.id,
          firstName: t.cashier.firstName,
          lastName: t.cashier.lastName,
          email: t.cashier.email,
        }
      : null,
  }));
  res.json(result);
});

// Get single transaction
router.get("/:id", async (req, res) => {
  const transaction = await repo().findOne({
    where: { id: req.params.id },
    relations: ["cashier", "items"],
  });
  if (!transaction) {
    res.status(404).json({ error: "Transaction not found" });
    return;
  }
  const result = {
    ...transaction,
    cashier: transaction.cashier
      ? {
          id: transaction.cashier.id,
          firstName: transaction.cashier.firstName,
          lastName: transaction.cashier.lastName,
          email: transaction.cashier.email,
        }
      : null,
  };
  res.json(result);
});

// Create transaction (from POS checkout)
router.post("/", async (req, res) => {
  const { items, subtotal, tax, total, amountTendered, change } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "Transaction must have at least one item" });
    return;
  }

  const cashierId = req.staff?.id;
  if (!cashierId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  // Generate receipt number: RCP-YYYYMMDD-XXXX
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  const receiptNumber = `RCP-${datePart}-${rand}`;

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Deduct stock for item-type products
    for (const item of items) {
      const product = await productRepo().findOneBy({ id: item.productId });
      if (!product) {
        res.status(400).json({ error: `Product ${item.productId} not found` });
        await queryRunner.rollbackTransaction();
        return;
      }
      if (product.type === "item") {
        if (product.quantity < item.quantity) {
          res.status(400).json({
            error: `Insufficient stock for ${product.name}`,
          });
          await queryRunner.rollbackTransaction();
          return;
        }
        product.quantity -= item.quantity;
        await queryRunner.manager.save(product);
      }
    }

    const transaction = queryRunner.manager.create(Transaction, {
      receiptNumber,
      cashierId,
      subtotal,
      tax,
      total,
      amountTendered,
      change,
      items: items.map(
        (item: {
          productId: string;
          productName: string;
          unitPrice: number;
          quantity: number;
          lineTotal: number;
        }) => ({
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
        }),
      ),
    });

    const saved = await queryRunner.manager.save(transaction);
    await queryRunner.commitTransaction();

    // Reload with relations
    const result = await repo().findOne({
      where: { id: saved.id },
      relations: ["cashier", "items"],
    });

    res.status(201).json(result);
  } catch (err) {
    await queryRunner.rollbackTransaction();
    res.status(500).json({ error: "Failed to create transaction" });
  } finally {
    await queryRunner.release();
  }
});

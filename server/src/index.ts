import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source.js";
import { requireAuth } from "./middleware/auth.js";
import { router as healthRouter } from "./routes/health.js";
import { router as authRouter } from "./routes/auth.js";
import { router as productRouter } from "./routes/products.js";
import { router as staffRouter } from "./routes/staff.js";
import { router as categoryRouter } from "./routes/categories.js";
import { router as transactionRouter } from "./routes/transactions.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", requireAuth, productRouter);
app.use("/api/staff", requireAuth, staffRouter);
app.use("/api/categories", requireAuth, categoryRouter);
app.use("/api/transactions", requireAuth, transactionRouter);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

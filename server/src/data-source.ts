import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "./entities/Product.js";
import { Staff } from "./entities/Staff.js";
import { Category } from "./entities/Category.js";
import { SubCategory } from "./entities/SubCategory.js";
import { Transaction } from "./entities/Transaction.js";
import { TransactionItem } from "./entities/TransactionItem.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL ?? "postresql://postgres:postgres@localhost:5432/brevstar_pos",
  synchronize: false,
  logging: false,
  entities: [
    Product,
    Staff,
    Category,
    SubCategory,
    Transaction,
    TransactionItem,
  ],
  migrations: [__dirname + "/migrations/*.{ts,js}"],
});

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Transaction } from "./Transaction.js";
import { Product } from "./Product.js";

@Entity("transaction_items")
export class TransactionItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Transaction, (txn) => txn.items, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "transactionId" })
  transaction!: Transaction;

  @Column({ type: "uuid" })
  transactionId!: string;

  @ManyToOne(() => Product, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "productId" })
  product!: Product;

  @Column({ type: "uuid" })
  productId!: string;

  @Column({ type: "varchar", length: 255 })
  productName!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  unitPrice!: number;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  lineTotal!: number;
}

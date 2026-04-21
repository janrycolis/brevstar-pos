import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Staff } from "./Staff.js";
import { TransactionItem } from "./TransactionItem.js";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 20, unique: true })
  receiptNumber!: string;

  @ManyToOne(() => Staff, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "cashierId" })
  cashier!: Staff;

  @Column({ type: "uuid" })
  cashierId!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  subtotal!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  tax!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amountTendered!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  change!: number;

  @OneToMany(() => TransactionItem, (item) => item.transaction, {
    cascade: true,
  })
  items!: TransactionItem[];

  @CreateDateColumn()
  createdAt!: Date;
}

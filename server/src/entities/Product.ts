import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Category } from "./Category.js";
import { SubCategory } from "./SubCategory.js";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "varchar", length: 100, unique: true })
  sku!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  barcode!: string | null;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "varchar", length: 20, default: "'item'" })
  type!: "item" | "service";

  @Column({ type: "int", default: 0 })
  quantity!: number;

  @ManyToOne(() => Category, (cat) => cat.products, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "categoryId" })
  category!: Category | null;

  @Column({ type: "uuid", nullable: true })
  categoryId!: string | null;

  @ManyToOne(() => SubCategory, (sub) => sub.products, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "subCategoryId" })
  subCategory!: SubCategory | null;

  @Column({ type: "uuid", nullable: true })
  subCategoryId!: string | null;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

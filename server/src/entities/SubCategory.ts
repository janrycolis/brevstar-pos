import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from "typeorm";
import { Category } from "./Category.js";
import { Product } from "./Product.js";

@Entity("sub_categories")
@Unique(["name", "categoryId"])
export class SubCategory {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @ManyToOne(() => Category, (cat) => cat.subCategories, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "categoryId" })
  category!: Category;

  @Column({ type: "uuid" })
  categoryId!: string;

  @OneToMany(() => Product, (product) => product.subCategory)
  products!: Product[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

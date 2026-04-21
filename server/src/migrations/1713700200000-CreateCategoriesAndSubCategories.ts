import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumn,
  TableUnique,
} from "typeorm";

export class CreateCategoriesAndSubCategories1713700200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create categories table
    await queryRunner.createTable(
      new Table({
        name: "categories",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            length: "100",
            isUnique: true,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "isActive",
            type: "boolean",
            default: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
      true,
    );

    // 2. Create sub_categories table
    await queryRunner.createTable(
      new Table({
        name: "sub_categories",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            length: "100",
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "isActive",
            type: "boolean",
            default: true,
          },
          {
            name: "categoryId",
            type: "uuid",
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      "sub_categories",
      new TableForeignKey({
        columnNames: ["categoryId"],
        referencedTableName: "categories",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createUniqueConstraint(
      "sub_categories",
      new TableUnique({
        columnNames: ["name", "categoryId"],
      }),
    );

    // 3. Alter products: drop old category varchar, add categoryId & subCategoryId FKs
    await queryRunner.dropColumn("products", "category");

    await queryRunner.addColumn(
      "products",
      new TableColumn({
        name: "categoryId",
        type: "uuid",
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      "products",
      new TableColumn({
        name: "subCategoryId",
        type: "uuid",
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      "products",
      new TableForeignKey({
        columnNames: ["categoryId"],
        referencedTableName: "categories",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      }),
    );

    await queryRunner.createForeignKey(
      "products",
      new TableForeignKey({
        columnNames: ["subCategoryId"],
        referencedTableName: "sub_categories",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop FKs from products
    const productsTable = await queryRunner.getTable("products");
    const categoryFK = productsTable?.foreignKeys.find((fk) =>
      fk.columnNames.includes("categoryId"),
    );
    if (categoryFK) await queryRunner.dropForeignKey("products", categoryFK);

    const subCategoryFK = productsTable?.foreignKeys.find((fk) =>
      fk.columnNames.includes("subCategoryId"),
    );
    if (subCategoryFK)
      await queryRunner.dropForeignKey("products", subCategoryFK);

    // Drop columns from products
    await queryRunner.dropColumn("products", "categoryId");
    await queryRunner.dropColumn("products", "subCategoryId");

    // Re-add old category varchar column
    await queryRunner.addColumn(
      "products",
      new TableColumn({
        name: "category",
        type: "varchar",
        length: "100",
        isNullable: true,
      }),
    );

    // Drop sub_categories and categories tables
    await queryRunner.dropTable("sub_categories");
    await queryRunner.dropTable("categories");
  }
}

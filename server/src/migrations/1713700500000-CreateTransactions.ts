import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateTransactions1713700500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "transactions",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "receiptNumber",
            type: "varchar",
            length: "20",
            isUnique: true,
          },
          {
            name: "cashierId",
            type: "uuid",
          },
          {
            name: "subtotal",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
          {
            name: "tax",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
          {
            name: "total",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
          {
            name: "amountTendered",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
          {
            name: "change",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
          {
            name: "createdAt",
            type: "timestamptz",
            default: "now()",
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "transactions",
      new TableForeignKey({
        columnNames: ["cashierId"],
        referencedTableName: "staff",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "transaction_items",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "transactionId",
            type: "uuid",
          },
          {
            name: "productId",
            type: "uuid",
          },
          {
            name: "productName",
            type: "varchar",
            length: "255",
          },
          {
            name: "unitPrice",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
          {
            name: "quantity",
            type: "int",
          },
          {
            name: "lineTotal",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "transaction_items",
      new TableForeignKey({
        columnNames: ["transactionId"],
        referencedTableName: "transactions",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "transaction_items",
      new TableForeignKey({
        columnNames: ["productId"],
        referencedTableName: "products",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("transaction_items");
    await queryRunner.dropTable("transactions");
  }
}

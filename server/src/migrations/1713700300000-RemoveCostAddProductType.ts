import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class RemoveCostAddProductType1713700300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop cost column
    await queryRunner.dropColumn("products", "cost");

    // Add type column (item | service), default 'item'
    await queryRunner.addColumn(
      "products",
      new TableColumn({
        name: "type",
        type: "varchar",
        length: "20",
        default: "'item'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("products", "type");

    await queryRunner.addColumn(
      "products",
      new TableColumn({
        name: "cost",
        type: "decimal",
        precision: 10,
        scale: 2,
        default: 0,
      }),
    );
  }
}

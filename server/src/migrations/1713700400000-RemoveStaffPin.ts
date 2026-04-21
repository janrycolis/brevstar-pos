import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class RemoveStaffPin1713700400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("staff", "pin");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "staff",
      new TableColumn({
        name: "pin",
        type: "varchar",
        length: "4",
        isNullable: true,
      }),
    );
  }
}

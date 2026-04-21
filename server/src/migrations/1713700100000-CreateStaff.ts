import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateStaff1713700100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "staff_role_enum" AS ENUM ('admin', 'manager', 'cashier')`,
    );

    await queryRunner.createTable(
      new Table({
        name: "staff",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "firstName",
            type: "varchar",
            length: "100",
          },
          {
            name: "lastName",
            type: "varchar",
            length: "100",
          },
          {
            name: "email",
            type: "varchar",
            length: "255",
            isUnique: true,
          },
          {
            name: "passwordHash",
            type: "varchar",
            length: "255",
          },
          {
            name: "pin",
            type: "varchar",
            length: "4",
            isNullable: true,
          },
          {
            name: "role",
            type: "staff_role_enum",
            default: "'cashier'",
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("staff");
    await queryRunner.query(`DROP TYPE "staff_role_enum"`);
  }
}

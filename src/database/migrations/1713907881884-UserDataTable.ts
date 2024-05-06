import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class UserDataTable1713907881884 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user_data",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            unsigned: true,
            generationStrategy: "increment",
          },
          {
            name: "user_id",
            type: "int",
            isNullable: false,
            unsigned: true,
          },
          {
            name: "data_json",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "highest_level",
            type: "int",
            isNullable: true,
          },
          {
            name: "total_experience",
            type: "int",
            isNullable: true,
          },
          {
            name: "total_gold",
            type: "int",
            isNullable: true,
          },
          {
            name: "premium",
            type: "varchar",
            default: "'no'",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          {
            name: "FK_USER_DATA_USER_ID",
            columnNames: ["user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
          },
        ],
        indices: [
          {
            name: "IDX_USER_DATA_USER_ID_PREMIUM",
            columnNames: ["user_id", "premium"],
            isUnique: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user_data");
  }
}

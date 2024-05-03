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
            generationStrategy: "increment",
          },
          {
            name: "data_json",
            type: "jsonb",
          },
          {
            name: "highest_level",
            type: "int",
          },
          {
            name: "total_experience",
            type: "int",
          },
          {
            name: "total_gold",
            type: "int",
          },
          {
            name: "premium",
            type: "varchar",
            default: "'no'",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user_data");
  }
}

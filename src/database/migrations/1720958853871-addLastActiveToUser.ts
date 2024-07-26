import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLastActiveToUser1720958853871 implements MigrationInterface {
  name = "AddLastActiveToUser1720958853871";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "app1"."users" ADD "last_active" TIMESTAMP NOT NULL DEFAULT now()`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "app1"."users" DROP COLUMN "last_active"`
    );
  }
}

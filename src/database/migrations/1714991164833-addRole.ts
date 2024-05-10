import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRole1714991164833 implements MigrationInterface {
  name = "AddRole1714991164833";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "app1"."users" ADD "role" character varying NOT NULL DEFAULT 'user'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "app1"."users" DROP COLUMN "role"`);
  }
}

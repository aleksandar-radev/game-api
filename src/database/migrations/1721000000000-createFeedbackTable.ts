import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFeedbackTable1721000000000 implements MigrationInterface {
  name = 'CreateFeedbackTable1721000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "app1"."feedback" (
        "id" SERIAL NOT NULL, 
        "name" character varying, 
        "email" character varying, 
        "message" text, 
        "status" character varying NOT NULL DEFAULT 'pending', 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_feedback" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "app1"."feedback"`);
  }
}

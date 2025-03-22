import { MigrationInterface, QueryRunner } from 'typeorm';

export class Sync1714959457506 implements MigrationInterface {
  name = 'Sync1714959457506';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "app1"."users" ("id" SERIAL NOT NULL, "username" character varying, "password" character varying NOT NULL, "email" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))',
    );
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_USER_EMAIL" ON "app1"."users" ("email") ');
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_USER_USERNAME" ON "app1"."users" ("username") ');
    await queryRunner.query(
      'CREATE TABLE "app1"."user_data" ("id" SERIAL NOT NULL, "data_json" jsonb, "highest_level" integer, "total_experience" integer, "total_gold" integer, "premium" character varying NOT NULL DEFAULT \'no\', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "PK_73a2ae063ee34712f94b8248ced" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_USER_DATA_USER_ID_PREMIUM" ON "app1"."user_data" ("user_id", "premium") ',
    );
    await queryRunner.query(
      'ALTER TABLE "app1"."user_data" ADD CONSTRAINT "FK_USER_DATA_USER_ID" FOREIGN KEY ("user_id") REFERENCES "app1"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "app1"."user_data" DROP CONSTRAINT "FK_USER_DATA_USER_ID"');
    await queryRunner.query('DROP INDEX "app1"."IDX_USER_DATA_USER_ID_PREMIUM"');
    await queryRunner.query('DROP TABLE "app1"."user_data"');
    await queryRunner.query('DROP INDEX "app1"."IDX_USER_USERNAME"');
    await queryRunner.query('DROP INDEX "app1"."IDX_USER_EMAIL"');
    await queryRunner.query('DROP TABLE "app1"."users"');
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGamesTable1721000000000 implements MigrationInterface {
  name = 'CreateGamesTable1721000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "app1"."games" (
        "id" SERIAL NOT NULL, 
        "name" character varying NOT NULL, 
        "title" character varying NOT NULL, 
        "type" character varying NOT NULL, 
        "description" text, 
        "logo_url" character varying, 
        "big_logo_url" character varying, 
        "url" character varying, 
        "uploaded_by" integer, 
        "release_date" TIMESTAMP, 
        "rating" decimal(3,1), 
        "status" character varying NOT NULL DEFAULT 'active', 
        "version" character varying, 
        "is_featured" boolean NOT NULL DEFAULT false, 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "deleted_at" TIMESTAMP, 
        CONSTRAINT "PK_games" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(`CREATE INDEX "IDX_GAMES_NAME" ON "app1"."games" ("name") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "app1"."IDX_GAMES_NAME"`);
    await queryRunner.query(`DROP TABLE "app1"."games"`);
  }
}

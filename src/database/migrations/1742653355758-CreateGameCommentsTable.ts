import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGameCommentsTable1742653355758 implements MigrationInterface {
  name = 'CreateGameCommentsTable1742653355758';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "app1"."game_comments" (
        "id" SERIAL NOT NULL, 
        "game_id" integer NOT NULL,
        "user_id" integer NOT NULL,
        "content" text NOT NULL,
        "status" character varying NOT NULL DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_game_comments" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query('CREATE INDEX "IDX_GAME_COMMENTS_GAME_ID" ON "app1"."game_comments" ("game_id") ');
    await queryRunner.query('CREATE INDEX "IDX_GAME_COMMENTS_USER_ID" ON "app1"."game_comments" ("user_id") ');

    await queryRunner.query(
      `ALTER TABLE "app1"."game_comments" ADD CONSTRAINT "FK_GAME_COMMENTS_GAME_ID" 
       FOREIGN KEY ("game_id") REFERENCES "app1"."games"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "app1"."game_comments" ADD CONSTRAINT "FK_GAME_COMMENTS_USER_ID" 
       FOREIGN KEY ("user_id") REFERENCES "app1"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "app1"."game_comments" DROP CONSTRAINT "FK_GAME_COMMENTS_USER_ID"');
    await queryRunner.query('ALTER TABLE "app1"."game_comments" DROP CONSTRAINT "FK_GAME_COMMENTS_GAME_ID"');
    await queryRunner.query('DROP INDEX "app1"."IDX_GAME_COMMENTS_USER_ID"');
    await queryRunner.query('DROP INDEX "app1"."IDX_GAME_COMMENTS_GAME_ID"');
    await queryRunner.query('DROP TABLE "app1"."game_comments"');
  }
}

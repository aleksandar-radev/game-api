import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGameCommentReactionsTable1721000000002 implements MigrationInterface {
  name = 'CreateGameCommentReactionsTable1721000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "app1"."game_comment_reactions" (
        "id" SERIAL NOT NULL, 
        "comment_id" integer NOT NULL,
        "user_id" integer NOT NULL,
        "reaction_type" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_game_comment_reactions" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_comment_reaction" UNIQUE ("user_id", "comment_id")
      )`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_COMMENT_REACTIONS_COMMENT_ID" ON "app1"."game_comment_reactions" ("comment_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_COMMENT_REACTIONS_USER_ID" ON "app1"."game_comment_reactions" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_COMMENT_REACTIONS_TYPE" ON "app1"."game_comment_reactions" ("reaction_type") `,
    );

    await queryRunner.query(
      `ALTER TABLE "app1"."game_comment_reactions" ADD CONSTRAINT "FK_COMMENT_REACTIONS_COMMENT_ID" 
       FOREIGN KEY ("comment_id") REFERENCES "app1"."game_comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "app1"."game_comment_reactions" ADD CONSTRAINT "FK_COMMENT_REACTIONS_USER_ID" 
       FOREIGN KEY ("user_id") REFERENCES "app1"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "app1"."game_comment_reactions" DROP CONSTRAINT "FK_COMMENT_REACTIONS_USER_ID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app1"."game_comment_reactions" DROP CONSTRAINT "FK_COMMENT_REACTIONS_COMMENT_ID"`,
    );
    await queryRunner.query(`DROP INDEX "app1"."IDX_COMMENT_REACTIONS_TYPE"`);
    await queryRunner.query(`DROP INDEX "app1"."IDX_COMMENT_REACTIONS_USER_ID"`);
    await queryRunner.query(`DROP INDEX "app1"."IDX_COMMENT_REACTIONS_COMMENT_ID"`);
    await queryRunner.query(`DROP TABLE "app1"."game_comment_reactions"`);
  }
}

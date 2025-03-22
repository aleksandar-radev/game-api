import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedAtToGameCommentReactions1742654048602 implements MigrationInterface {
  name = 'AddDeletedAtToGameCommentReactions1742654048602';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "app1"."game_comment_reactions" ADD "deleted_at" TIMESTAMP');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "app1"."game_comment_reactions" DROP COLUMN "deleted_at"');
  }
}

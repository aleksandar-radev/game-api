import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGameDataLeaderboardStats1746500000000 implements MigrationInterface {
  name = 'UpdateGameDataLeaderboardStats1746500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "app1"."game_data" DROP COLUMN IF EXISTS "highest_level"');
    await queryRunner.query('ALTER TABLE "app1"."game_data" DROP COLUMN IF EXISTS "total_experience"');
    await queryRunner.query('ALTER TABLE "app1"."game_data" DROP COLUMN IF EXISTS "total_gold"');
    await queryRunner.query('ALTER TABLE "app1"."game_data" ADD "leaderboard_stats" jsonb');
    await queryRunner.query(
      'CREATE INDEX "IDX_GAME_DATA_LEADERBOARD_SCORE" ON "app1"."game_data" ((leaderboard_stats->>\'highestScore\'))',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "app1"."IDX_GAME_DATA_LEADERBOARD_SCORE"');
    await queryRunner.query('ALTER TABLE "app1"."game_data" DROP COLUMN "leaderboard_stats"');
    await queryRunner.query('ALTER TABLE "app1"."game_data" ADD "total_gold" integer');
    await queryRunner.query('ALTER TABLE "app1"."game_data" ADD "total_experience" integer');
    await queryRunner.query('ALTER TABLE "app1"."game_data" ADD "highest_level" integer');
  }
}

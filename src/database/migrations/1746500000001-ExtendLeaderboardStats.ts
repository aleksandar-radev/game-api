import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExtendLeaderboardStats1746500000001 implements MigrationInterface {
  name = 'ExtendLeaderboardStats1746500000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'UPDATE "app1"."game_data" SET leaderboard_stats = \'{}\'::jsonb WHERE leaderboard_stats IS NULL;',
    );
    await queryRunner.query(
      'UPDATE "app1"."game_data" SET leaderboard_stats = jsonb_set(leaderboard_stats, \'{highestLevel}\', \'0\', true) WHERE NOT (leaderboard_stats ? \'highestLevel\');',
    );
    await queryRunner.query(
      'UPDATE "app1"."game_data" SET leaderboard_stats = jsonb_set(leaderboard_stats, \'{highestStage}\', \'0\', true) WHERE NOT (leaderboard_stats ? \'highestStage\');',
    );
    await queryRunner.query(
      'UPDATE "app1"."game_data" SET leaderboard_stats = jsonb_set(leaderboard_stats, \'{totalKills}\', \'0\', true) WHERE NOT (leaderboard_stats ? \'totalKills\');',
    );
    await queryRunner.query(
      'UPDATE "app1"."game_data" SET leaderboard_stats = jsonb_set(leaderboard_stats, \'{totalGold}\', \'0\', true) WHERE NOT (leaderboard_stats ? \'totalGold\');',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_GAME_DATA_LEADERBOARD_LEVEL" ON "app1"."game_data" ((leaderboard_stats->>\'highestLevel\'))',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_GAME_DATA_LEADERBOARD_STAGE" ON "app1"."game_data" ((leaderboard_stats->>\'highestStage\'))',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_GAME_DATA_LEADERBOARD_KILLS" ON "app1"."game_data" ((leaderboard_stats->>\'totalKills\'))',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_GAME_DATA_LEADERBOARD_GOLD" ON "app1"."game_data" ((leaderboard_stats->>\'totalGold\'))',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "app1"."IDX_GAME_DATA_LEADERBOARD_GOLD"');
    await queryRunner.query('DROP INDEX "app1"."IDX_GAME_DATA_LEADERBOARD_KILLS"');
    await queryRunner.query('DROP INDEX "app1"."IDX_GAME_DATA_LEADERBOARD_STAGE"');
    await queryRunner.query('DROP INDEX "app1"."IDX_GAME_DATA_LEADERBOARD_LEVEL"');
  }
}

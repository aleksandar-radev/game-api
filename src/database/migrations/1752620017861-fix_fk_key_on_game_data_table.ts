import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixFkKeyOnGameDataTable1752620017861 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the old index
    await queryRunner.query('DROP INDEX IF EXISTS "app1"."IDX_GAME_DATA_USER_ID_PREMIUM"');
    // Create the new index including game_id
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_GAME_DATA_USER_ID_GAME_ID_PREMIUM" ON "app1"."game_data" ("user_id", "game_id", "premium")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the new index
    await queryRunner.query('DROP INDEX IF EXISTS "app1"."IDX_GAME_DATA_USER_ID_GAME_ID_PREMIUM"');
    // Restore the old index
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_GAME_DATA_USER_ID_PREMIUM" ON "app1"."game_data" ("user_id", "premium")');
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGameIdToGameData1742654064147 implements MigrationInterface {
  name = 'AddGameIdToGameData1742654064147';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add the game_id column to game_data table
    await queryRunner.query('ALTER TABLE "app1"."game_data" ADD "game_id" integer');

    // Create an index for the game_id column
    await queryRunner.query('CREATE INDEX "IDX_GAME_DATA_GAME_ID" ON "app1"."game_data" ("game_id")');

    // Add the foreign key constraint
    await queryRunner.query(
      `ALTER TABLE "app1"."game_data" ADD CONSTRAINT "FK_GAME_DATA_GAME_ID" 
        FOREIGN KEY ("game_id") REFERENCES "app1"."games"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraint
    await queryRunner.query('ALTER TABLE "app1"."game_data" DROP CONSTRAINT "FK_GAME_DATA_GAME_ID"');

    // Drop the index
    await queryRunner.query('DROP INDEX "app1"."IDX_GAME_DATA_GAME_ID"');

    // Drop the column
    await queryRunner.query('ALTER TABLE "app1"."game_data" DROP COLUMN "game_id"');
  }
}

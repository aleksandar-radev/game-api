import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameUserDataToGameData1742654056646 implements MigrationInterface {
  name = 'RenameUserDataToGameData1742654056646';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the existing foreign key constraint
    await queryRunner.query('ALTER TABLE "app1"."user_data" DROP CONSTRAINT "FK_USER_DATA_USER_ID"');

    // Drop the existing index
    await queryRunner.query('DROP INDEX "app1"."IDX_USER_DATA_USER_ID_PREMIUM"');

    // Rename the table
    await queryRunner.query('ALTER TABLE "app1"."user_data" RENAME TO "game_data"');

    // Create new index with updated name
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_GAME_DATA_USER_ID_PREMIUM" ON "app1"."game_data" ("user_id", "premium") ',
    );

    // Add back the foreign key with updated name
    await queryRunner.query(
      'ALTER TABLE "app1"."game_data" ADD CONSTRAINT "FK_GAME_DATA_USER_ID" FOREIGN KEY ("user_id") REFERENCES "app1"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the new foreign key constraint
    await queryRunner.query('ALTER TABLE "app1"."game_data" DROP CONSTRAINT "FK_GAME_DATA_USER_ID"');

    // Drop the new index
    await queryRunner.query('DROP INDEX "app1"."IDX_GAME_DATA_USER_ID_PREMIUM"');

    // Rename the table back
    await queryRunner.query('ALTER TABLE "app1"."game_data" RENAME TO "user_data"');

    // Create the original index
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_USER_DATA_USER_ID_PREMIUM" ON "app1"."user_data" ("user_id", "premium") ',
    );

    // Add back the original foreign key
    await queryRunner.query(
      'ALTER TABLE "app1"."user_data" ADD CONSTRAINT "FK_USER_DATA_USER_ID" FOREIGN KEY ("user_id") REFERENCES "app1"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }
}

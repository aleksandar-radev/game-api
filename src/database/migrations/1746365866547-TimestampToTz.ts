import { MigrationInterface, QueryRunner } from 'typeorm';

export class TimestampToTz1746365866547 implements MigrationInterface {
  name = 'TimestampToTz1746365866547';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "app1"."game_data" ALTER COLUMN "created_at" TYPE TIMESTAMP WITH TIME ZONE USING "created_at" AT TIME ZONE \'UTC\'',
    );
    await queryRunner.query(
      'ALTER TABLE "app1"."game_data" ALTER COLUMN "updated_at" TYPE TIMESTAMP WITH TIME ZONE USING "updated_at" AT TIME ZONE \'UTC\'',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "app1"."game_data" ALTER COLUMN "created_at" TYPE TIMESTAMP WITHOUT TIME ZONE USING "created_at" AT TIME ZONE \'UTC\'',
    );
    await queryRunner.query(
      'ALTER TABLE "app1"."game_data" ALTER COLUMN "updated_at" TYPE TIMESTAMP WITHOUT TIME ZONE USING "updated_at" AT TIME ZONE \'UTC\'',
    );
  }
}

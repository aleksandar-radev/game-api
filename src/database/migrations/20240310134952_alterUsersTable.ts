import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (t) => {
    t.string("password").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {}

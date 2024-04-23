import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user_data", (table) => {
    table.increments("id").primary().unsigned();
    table.jsonb("data_json");
    table.integer("highest_level");
    table.integer("total_experience");
    table.integer("total_gold");
    table.string("premium").defaultTo("no");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("user_data");
}

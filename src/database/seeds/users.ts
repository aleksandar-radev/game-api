import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert([
    {
      id: 1,
      email: "admin@example.com",
      username: "admin",
      password: "Admin123!",
    },
  ]);
}

import bcrypt from "bcryptjs";
import { Knex } from "knex";
import readline from "readline";

export async function seed(knex: Knex): Promise<void> {
  // Disallow seeding in production
  if (process.env.ENV !== "local") {
    if (process.env.ENV !== "development") {
      throw new Error(
        "Seeding not allowed in environment other than local/development."
      );
    }
    // development env check
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await new Promise<string>((resolve) => {
      rl.question(
        "This is the development environment. Do you still want to proceed with seeding? (deletes all entries and recreates) (yes/no) ",
        (ans) => {
          rl.close();
          resolve(ans);
        }
      );
    });

    if (answer.toLowerCase() !== "yes") {
      throw new Error("Seeding aborted by the user.");
    }
  }

  await knex("users").del();

  const salt = await bcrypt.genSalt(10);
  const pwd = await bcrypt.hash("Admin123!", salt);

  const users = [
    {
      email: "admin@example.com",
      username: "admin",
      password: pwd,
    },
    {
      email: "pool@example.com",
      username: "pool",
      password: pwd,
    },
    {
      email: "pool1@example.com",
      username: "pool1",
      password: pwd,
    },
  ];

  // Inserts seed entries
  await knex("users").insert(users);
}

import bcrypt from "bcryptjs";
import { DataSource } from "typeorm";
import { User } from "../../models/User";

export async function seedUsers(dataSource: DataSource): Promise<void> {
  console.log("Seeding users");

  const userRepository = dataSource.getRepository(User);

  if ((await userRepository.find()).length > 0) {
    console.log("Users already seeded");
    return;
  }

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

  await userRepository.save(users);
  console.log("Seeding users complete --------- ");
}

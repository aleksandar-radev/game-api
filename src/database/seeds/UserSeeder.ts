import bcrypt from "bcryptjs";
import { DataSource } from "typeorm";
import { User } from "../../models/User";

export class UserSeeder {
  constructor(public dataSource: DataSource) {}
  public async seed(): Promise<void> {
    console.log("Seeding users");

    const userRepository = this.dataSource.getRepository(User);

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
        role: User.ROLE_ADMIN,
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

    await userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(users)
      .execute();

    console.log("Seeding users complete --------- ");
  }
}

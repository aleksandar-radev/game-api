import { DataSource } from "typeorm";
import { User } from "../../models/User";
import { UserData } from "../../models/UserData";

export class UserDataSeeder {
  constructor(public dataSource: DataSource) {}
  public async seed(): Promise<void> {
    console.log("Seeding user data");

    const userRepository = this.dataSource.getRepository(User);
    const userDataRepository = this.dataSource.getRepository(UserData);

    if ((await userDataRepository.find()).length > 0) {
      console.log("User data already seeded");
      return;
    }

    const userData = [];
    const users = await userRepository.find();

    for (const user of users) {
      userData.push({
        user: user,
      });
    }

    await userDataRepository.save(userData);
    console.log("Seeding user data complete --------- ");
  }
}

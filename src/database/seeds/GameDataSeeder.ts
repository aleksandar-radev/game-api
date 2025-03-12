import { DataSource } from 'typeorm';
import { User } from '../../entities/User';
import { GameData } from '../../entities/GameData';

export class GameDataSeeder {
  constructor(public dataSource: DataSource) {}
  public async seed(): Promise<void> {
    console.log('Seeding user data');

    const userRepository = this.dataSource.getRepository(User);
    const gameDataRepository = this.dataSource.getRepository(GameData);

    if ((await gameDataRepository.find()).length > 0) {
      console.log('User data already seeded');
      return;
    }

    const gameData = [];
    const users = await userRepository.find();

    for (const user of users) {
      gameData.push({
        user: user,
      });
    }

    await gameDataRepository.save(gameData);
    console.log('Seeding user data complete --------- ');
  }
}

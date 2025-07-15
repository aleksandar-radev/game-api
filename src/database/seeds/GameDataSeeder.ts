import { DataSource } from 'typeorm';
import { User } from '../../entities/User';
import { GameData } from '../../entities/GameData';
import { Game } from '../../entities/Game';

export class GameDataSeeder {
  constructor(public dataSource: DataSource) {}
  public async seed(): Promise<void> {
    console.log('Seeding user data');

    const userRepository = this.dataSource.getRepository(User);
    const gameDataRepository = this.dataSource.getRepository(GameData);
    const gameRepository = this.dataSource.getRepository(Game);

    if ((await gameDataRepository.find()).length > 0) {
      console.log('User data already seeded');
      return;
    }

    const gameData = [];
    const users = await userRepository.find();
    const game = await gameRepository.findOne({ where: { name: 'endless' } });

    if (!game) {
      console.log('Game not found');
      return;
    }

    for (const user of users) {
      gameData.push({
        user: user,
        game: game,
      });
    }

    await gameDataRepository.save(gameData);
    console.log('Seeding user data complete --------- ');
  }
}

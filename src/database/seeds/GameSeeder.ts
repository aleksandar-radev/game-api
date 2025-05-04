import { DataSource } from 'typeorm';
import { Game } from '../../entities/Game';
import { User } from '../../entities/User';

export class GameSeeder {
  constructor(public dataSource: DataSource) {}
  public async seed(): Promise<void> {
    console.log('Seeding games');

    const gameRepository = this.dataSource.getRepository(Game);
    const userRepository = this.dataSource.getRepository(User);

    if ((await gameRepository.find()).length > 0) {
      console.log('Games already seeded');
      return;
    }

    // Find admin user to set as uploader
    const admin = await userRepository.findOne({ where: { role: User.ROLE_ADMIN } });

    const games = [
      {
        name: 'endless',
        title: 'Endless Runner',
        type: 'arcade',
        description: 'An endless runner game where you dodge obstacles and collect coins.',
        logoUrl: 'http://localhost:5173/endless-logo.png',
        bigLogoUrl: 'http://localhost:5173/endless-big-logo.png',
        url: 'http://localhost:5173/endless',
        uploadedById: admin?.id,
        releaseDate: new Date(),
        rating: 4.5,
        status: 'active',
        version: '1.0.0',
        isFeatured: true,
      },
      {
        name: 'animal-idle',
        title: 'Animal Idle',
        type: 'idle',
        description: 'An idle game where you collect and upgrade various animals to earn resources.',
        logoUrl: 'http://localhost:5173/animal-idle-logo.png',
        bigLogoUrl: 'http://localhost:5173/animal-idle-big-logo.png',
        url: 'http://localhost:5173/animal-idle',
        uploadedById: admin?.id,
        releaseDate: new Date(),
        rating: 4.2,
        status: 'active',
        version: '1.0.0',
        isFeatured: false,
      },
    ];

    await gameRepository.createQueryBuilder().insert().into(Game).values(games).execute();

    console.log('Seeding games complete --------- ');
  }
}

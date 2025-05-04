import { Service } from 'typedi';
import { GameData } from '../entities/GameData';
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/connection';

@Service()
export class GameDataRepository extends Repository<GameData> {
  constructor() {
    super(GameData, AppDataSource.createEntityManager());
  }

  async updateAndGet(id: number, gameData: Partial<GameData>): Promise<GameData | null> {
    const entity = await this.findOne({ where: { user: { id }, premium: gameData.premium } });
    if (!entity) return null;
    Object.assign(entity, gameData);
    await this.save(entity);
    return entity;
  }

  async getByUserIdAndPremium(id: number, premium: string): Promise<GameData | null> {
    return this.findOne({ where: { user: { id }, premium } });
  }
}

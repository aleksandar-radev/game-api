import { Service } from 'typedi';
import { Game } from '../entities/Game';
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/connection';

@Service()
export class GameRepository extends Repository<Game> {
  constructor() {
    super(Game, AppDataSource.createEntityManager());
  }
}

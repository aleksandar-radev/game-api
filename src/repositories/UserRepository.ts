import { Service } from 'typedi';
import { User } from '../models/User';
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/connection';

@Service()
export class UserRepository extends Repository<User> {
  constructor() {
    super(User, AppDataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }
}

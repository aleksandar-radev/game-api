import { Service } from 'typedi';
import { Feedback } from '../entities/Feedback';
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/connection';

@Service()
export class FeedbackRepository extends Repository<Feedback> {
  constructor() {
    super(Feedback, AppDataSource.createEntityManager());
  }

  async findLatest(limit: number = 10): Promise<Feedback[]> {
    return this.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findByStatus(status: string): Promise<Feedback[]> {
    return this.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }
}

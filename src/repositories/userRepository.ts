import { Service } from "typedi";
import { User } from "../models/User";
import { Repository } from "typeorm";
import { AppDataSource } from "../database/connection";

@Service()
export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findOne(options: object): Promise<User | null> {
    return this.repository.findOne(options);
  }

  async createUser(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async find(): Promise<User[]> {
    return this.repository.find();
  }
}

export default UserRepository;

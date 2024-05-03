import { Service } from "typedi";
import { UserData } from "../models/UserData";
import { Repository } from "typeorm";
import { AppDataSource } from "../database/connection";

@Service()
export class UserDataRepository {
  private repository: Repository<UserData>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserData);
  }

  async findOne(options: object): Promise<UserData | null> {
    return this.repository.findOne(options);
  }

  async createUserData(userData: UserData): Promise<UserData> {
    return this.repository.save(userData);
  }

  async find(): Promise<UserData[]> {
    return this.repository.find();
  }

  async updateUserData(
    id: number,
    userData: Partial<UserData>
  ): Promise<UserData | null> {
    await this.repository.update(id, userData);
    return this.repository.findOne({ where: { id } });
  }

  async deleteUserData(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}

export default UserDataRepository;

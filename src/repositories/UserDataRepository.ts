import { Service } from "typedi";
import { UserData } from "../models/UserData";
import { Repository } from "typeorm";
import { AppDataSource } from "../database/connection";

@Service()
export class UserDataRepository extends Repository<UserData> {
  constructor() {
    super(UserData, AppDataSource.createEntityManager());
  }

  async updateAndGet(
    id: number,
    userData: Partial<UserData>
  ): Promise<UserData | null> {
    await this.update(id, userData);
    return this.findOne({ where: { id } });
  }
}

// userRepository.ts

import knex from "knex";
import { IUser } from "../models/User";

class UserRepository {
  private tableName: string = "users";

  public async createUser(user: IUser): Promise<number> {
    const [userId] = await knex(this.tableName).insert(user).returning("id");
    return userId;
  }

  public async findUserByEmail(email: string): Promise<IUser | undefined> {
    const user = await knex(this.tableName).where({ email }).first();
    return user;
  }

  public async findUserById(id: number): Promise<IUser | undefined> {
    const user = await knex(this.tableName).where({ id }).first();
    return user;
  }

  // You can add more methods here as needed, such as update or delete operations
}

export const userRepository = new UserRepository();

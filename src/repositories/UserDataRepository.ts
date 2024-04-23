import { Knex } from "knex";
import { IUserData, UserData } from "../models/UserData";

export class UserDataRepository {
  constructor(private knex: Knex) {}

  async getUserDataById(id: number): Promise<IUserData | undefined> {
    const result = await this.knex<UserData>("user_data")
      .select("*")
      .where("id", id)
      .first();
    return result;
  }

  async createUserData(userData: Partial<UserData>): Promise<UserData> {
    const [result] = await this.knex<UserData>("user_data")
      .insert(userData)
      .returning("*");
    return result;
  }

  async updateUserData(
    id: number,
    userData: Partial<UserData>
  ): Promise<UserData> {
    const [result] = await this.knex<UserData>("user_data")
      .where("id", id)
      .update(userData)
      .returning("*");
    return result;
  }

  async deleteUserData(id: number): Promise<void> {
    await this.knex<UserData>("user_data").where("id", id).del();
  }
}

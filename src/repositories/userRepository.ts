import { Service } from "typedi";
import db from "../database/database";
import { IUser } from "../models/User";
import BaseRepository from "./BaseRepository";

@Service()
export class UserRepository extends BaseRepository {
  private tableName = "users";

  constructor() {
    super();
  }
  findUserByEmail = async (email: string): Promise<IUser | undefined> => {
    const user = await db(this.tableName).where({ email }).first();
    return user;
  };
  createUser = async (user: IUser): Promise<number> => {
    const [userId] = await db(this.tableName).insert(user).returning("id");
    return userId.id;
  };
  findUserById = async (id: number): Promise<IUser | undefined> => {
    const user = await db(this.tableName).where({ id }).first();
    return user;
  };
}

export default UserRepository;

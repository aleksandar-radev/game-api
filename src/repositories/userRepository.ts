// userRepository.ts

import db from "../database/database";
import { DbNotFoundException } from "../helpers/error";
import { IUser } from "../models/User";

const tableName = "users";

export const userRepository = {
  createUser: async (user: IUser): Promise<number> => {
    const [userId] = await db(tableName).insert(user).returning("id");
    return userId.id;
  },
  findUserByEmail: async (email: string): Promise<IUser | undefined> => {
    const user = await db(tableName).where({ email }).first();
    return user;
  },
  findUserById: async (id: number): Promise<IUser | undefined> => {
    const user = await db(tableName).where({ id }).first();
    return user;
  },
  getUserById: async (id: number): Promise<IUser> => {
    const user = await db(tableName).where({ id }).first();
    if (!user) {
      throw new DbNotFoundException("User not found");
    }
    return user;
  },
};

export default userRepository;

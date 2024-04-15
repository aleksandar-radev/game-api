import { Request, Response } from "express";
import db from "../database/database";
import { AuthRequest } from "../helpers/request";

export const getUsers = async (req: AuthRequest, res: Response) => {
  const rows = await db.select("*").from("users");
  // const rows2 = await db("users").select("*");
  // const { rows } = await db.raw("SELECT * from users");

  res.json(rows);
};

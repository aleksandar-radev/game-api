import pagination from "./../helpers/pagination";
import { Response } from "express";
import db from "../database/database";
import { AuthRequest } from "../helpers/request";

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const pg = pagination.getPaginationOptions(req);

    const rows = await db
      .select("*")
      .from("users")
      .limit(pg.pageSize)
      .offset(pg.offset);

    res.json(rows);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

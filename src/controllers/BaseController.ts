// src\controllers\BaseController.ts
import { Response } from "express";
import { AuthRequest } from "../helpers/request";
import { BadRequestError } from "../helpers/error";
import pagination from "../helpers/pagination";
import db from "../database/database";

export class BaseController {
  protected async getAll(req: AuthRequest, tableName: string) {
    const pg = pagination.getPaginationOptions(req);

    const rows = await db
      .select("*")
      .from(tableName)
      .limit(pg.pageSize)
      .offset(pg.offset);

    return rows;
  }

  protected async getById(req: AuthRequest, tableName: string) {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      throw new BadRequestError("Invalid ID.");
    }

    const row = await db.select("*").from(tableName).where("id", id).first();
    return row;
  }

  protected async create(req: AuthRequest, res: Response, tableName: string) {
    const newRecord = await db(tableName).insert(req.body).returning("*");
    return newRecord;
  }

  protected async update(req: AuthRequest, res: Response, tableName: string) {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      throw new BadRequestError("Invalid ID.");
    }

    const updatedRecord = await db(tableName)
      .where("id", id)
      .update(req.body)
      .returning("*");

    return updatedRecord;
  }

  protected async delete(req: AuthRequest, res: Response, tableName: string) {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      throw new BadRequestError("Invalid ID.");
    }

    await db(tableName).where("id", id).del();
    return { message: "Record deleted successfully." };
  }
}

export default BaseController;

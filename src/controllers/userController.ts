import { Request, Response } from "express";
import db from "../database/database";
// Mock users array
const users = [{ id: 1, name: "John Doe" }];

export const getUsers = async (req: Request, res: Response) => {
  const rows = await db.select("*").from("users");
  // const rows2 = await db("users").select("*");
  // const { rows } = await db.raw("SELECT * from users");

  res.json(rows);
};

export const createUser = (req: Request, res: Response) => {
  const { name } = req.body;

  // In a real app, you would save the user to the database here
  const newUser = { id: Date.now(), name };
  users.push(newUser);

  res.status(201).json(newUser);
};

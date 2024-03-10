import { Request, Response } from "express";
import { query } from "../database/database";
// Mock users array
const users = [{ id: 1, name: "John Doe" }];

export const getUsers = (req: Request, res: Response) => {
  const rows = query("SELECT * FROM users");
  console.log("xxx", rows);

  res.json(users);
};

export const createUser = (req: Request, res: Response) => {
  const { name } = req.body;

  // In a real app, you would save the user to the database here
  const newUser = { id: Date.now(), name };
  users.push(newUser);

  res.status(201).json(newUser);
};

import { Request, Response } from "express";
import authService from "../services/authService";
import asyncHandler from "express-async-handler";
import { userRepository } from "../repositories/userRepository";
import { AuthenticationError } from "../helpers/error";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, confirmPassword } = req.body;

  await authService.validateRegistration(
    username,
    email,
    password,
    confirmPassword
  );

  const user = await authService.createUser(username, email, password);

  authService.generateToken(res, user.id);

  res.status(201).json(user);
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userRepository.findUserByEmail(email);

  if (user && (await authService.comparePassword(password, user))) {
    authService.generateToken(res, user.id);
    res.status(200).json(user);
  } else {
    throw new AuthenticationError("User not found / password incorrect");
  }
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  authService.clearToken(res);
  res.status(200).json({ message: "Successfully logged out" });
});

export { registerUser, loginUser, logoutUser };

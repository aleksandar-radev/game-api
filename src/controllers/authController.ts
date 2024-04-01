import { Request, Response } from "express";
import { generateToken, clearToken } from "../helpers/auth";
import bcrypt from "bcryptjs";
import {
  BadRequestError,
  AuthenticationError,
} from "../middleware/errorMiddleware";
import asyncHandler from "express-async-handler";
import { userRepository } from "../repositories/userRepository";
import { User } from "../models/User";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    throw new BadRequestError("Please provide all required fields");
  }

  if (password !== confirmPassword) {
    throw new BadRequestError("Passwords do not match");
  }

  if (password.length < 6) {
    throw new BadRequestError("Password must be at least 6 characters");
  }

  const userExists = await userRepository.findUserByEmail(email);

  if (userExists) {
    res.status(409).json({ message: "The email already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const pwd = await bcrypt.hash(password, salt);
  const userId = await userRepository.createUser(
    new User({ username, email, password: pwd })
  );

  if (!userId) {
    throw new BadRequestError("An error occurred in registering the user");
  }

  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw new BadRequestError("An error occurred in registering the user");
  }
  // generateToken(res, user.id);
  res.status(201).json(user);
});

const authenticateUser = asyncHandler(async (req: Request, res: Response) => {
  // const { email, password } = req.body;
  // const user = await User.findOne({ email });
  // if (user && (await user.comparePassword(password))) {
  //   generateToken(res, user._id);
  //   res.status(201).json({
  //     id: user._id,
  //     name: user.name,
  //     email: user.email,
  //   });
  // } else {
  //   throw new AuthenticationError("User not found / password incorrect");
  // }
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  clearToken(res);
  res.status(200).json({ message: "Successfully logged out" });
});

export { registerUser, authenticateUser, logoutUser };

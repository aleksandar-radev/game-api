import { authMiddleware } from "./../middleware/authMiddleware";
import express from "express";
import AuthController from "../controllers/AuthController";
import Container from "typedi";

const router = express.Router();
const authController = Container.get(AuthController);

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authMiddleware, authController.logoutUser);

export default router;

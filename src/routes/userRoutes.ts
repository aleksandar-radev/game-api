import { Router } from "express";
import UserController from "../controllers/UserController";
import { authMiddleware } from "../middleware/authMiddleware";
import Container from "typedi";

const router: Router = Router();
router.use(authMiddleware); // only Authenticated requests
const userController = Container.get(UserController);

router.get("/", userController.getUsers);

export default router;

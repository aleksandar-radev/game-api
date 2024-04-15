import { Router } from "express";
import { getUsers } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = Router();
router.use(authMiddleware); // only Authenticated requests

router.get("/", getUsers);

export default router;

import express, {Router} from "express";
import UserController from "../controllers/user.controller";
import {checkAuthorizationToken} from "../middlewares/authHandler";


const userRouter: Router = express.Router();
const userController = new UserController();

userRouter.use(checkAuthorizationToken);

userRouter.get("/:userId", userController.getUser);

userRouter.get("/:userId/drafts", userController.getDrafts);

export default userRouter;
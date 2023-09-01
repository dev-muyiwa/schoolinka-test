import express, {Router} from "express";
import UserController from "../controllers/user.controller";
import {checkAuthorizationToken} from "../middlewares/authHandler";


const userRouter: Router = express.Router();
const userController = new UserController();

userRouter.post("/:userId/token", userController.generateAccessToken);

userRouter.use(checkAuthorizationToken);
userRouter.get("/:userId", userController.getUser);
userRouter.get("/:userId/drafts", userController.getDrafts);
userRouter.post("/:userId/logout", userController.logout);

export default userRouter;
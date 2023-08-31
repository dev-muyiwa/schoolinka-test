import express, {Router} from "express";
import UserController from "../controllers/user.controller";


const userRouter: Router = express.Router();
const userController = new UserController();

userRouter.get("/:userId", userController.getUser);

export default userRouter;
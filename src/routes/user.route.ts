import express, {Router} from "express";
import UserController from "../controllers/user.controller";
import {checkAuthorizationToken, checkValidationErrors} from "../middlewares/authHandler";
import {check} from "express-validator";


const userRouter: Router = express.Router();
const userController: UserController = new UserController();


userRouter.post("/:userId/token",
    check("refreshToken").notEmpty(), checkValidationErrors,
    userController.generateAccessToken);

userRouter.use(checkAuthorizationToken);

userRouter.route("/:userId")
    .get(userController.getUser)
    .put(userController.updateProfile)
    .patch(check('currentPassword').notEmpty(),
        check('newPassword')
            .notEmpty()
            .isLength({min: 8})
            .withMessage('Password must be at least 8 characters.')
            .matches(/\d/)
            .withMessage("Password should have at least one digit.")
            .matches(/[!@#$%^&*(),.-?":{}|<>]/)
            .withMessage("Password should have at least one special character."),
        checkValidationErrors, userController.updatePassword);
userRouter.get("/:userId/drafts", userController.getDrafts);
userRouter.post("/:userId/logout", userController.logout);

export default userRouter;
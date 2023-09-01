import express, {Router} from "express";
import AuthController from "../controllers/auth.controller";
import {checkValidationErrors} from "../middlewares/authHandler";
import {check} from "express-validator";

const authRouter: Router = express.Router();
const authController: AuthController = new AuthController();


authRouter.post("/register",
    check("firstName").escape().notEmpty().isLength({max: 15}).withMessage("First name cannot be more than 15 characters"),
    check("lastName").escape().notEmpty().isLength({max: 15}).withMessage("Last name cannot be more than 15 characters"),
    check("email").escape().isEmail().withMessage("Invalid email address."),
    check('password')
        .notEmpty()
        .isLength({min: 8})
        .withMessage('password must be at least 8 characters')
        .matches(/\d/)
        .withMessage('password should have at least one number')
        .matches(/[!@#$%^&*(),.-?":{}|<>]/)
        .withMessage('password should have at least one special character'),
    checkValidationErrors, authController.register);


authRouter.post("/login",
    check("email").escape().trim().notEmpty(),
    check("password").escape().notEmpty(),
    checkValidationErrors, authController.login);

export default authRouter;
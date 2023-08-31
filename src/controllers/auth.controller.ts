import {Request, Response} from "express";
import User from "../models/user.model";
import {sendErrorResponse, sendSuccessResponse} from "../utils/ResponseHandlers";
import {CustomError} from "../utils/CustomError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {config} from "../config/config";

class AuthController {
    async register(req: Request, res: Response) {
        try {
            const {firstName, lastName, email, password} = req.body;
            const existingUser: User | null = await User.findOne({where: {email: email}});

            if (existingUser) {
                throw new CustomError("An account exists with this email/mobile.", CustomError.BAD_REQUEST);
            }

            const user: User = await User.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: await bcrypt.hash(password, 13)
            });

            return sendSuccessResponse(res, user, "Registration successful", 201);
        } catch (err) {
            return sendErrorResponse(res, err);
        }
    }

    async login(req: Request, res: Response) {
        try {
            const {email, password} = req.body;
            const existingUser: User | null = await User.findOne({where: {email: email}});

            if (!existingUser || !await bcrypt.compare(password, existingUser.password)) {
                throw new CustomError("An account exists with this email/mobile.", CustomError.BAD_REQUEST);
            }

            const refreshToken: string = existingUser.refreshToken ? existingUser.refreshToken : jwt.sign({
                name: existingUser.firstName + ' ' + existingUser.lastName,
                email: existingUser.email
            }, config.jwt_refresh_secret, {expiresIn: "7d", subject: existingUser.id})

            if (!refreshToken || !jwt.verify(existingUser.refreshToken, config.jwt_refresh_secret)) {
                existingUser.refreshToken = refreshToken
                await existingUser.save();
            }

            const accessToken: string = jwt.sign({
                name: existingUser.firstName + ' ' + existingUser.lastName,
                email: existingUser.email
            }, config.jwt_access_secret, {expiresIn: "30m", subject: existingUser.id});

            return sendSuccessResponse(res, {
                accessToken: accessToken,
                refreshToken: refreshToken
            }, "Login successful.");
        } catch (err) {
            return sendErrorResponse(res, err);
        }
    }
}

export default AuthController;
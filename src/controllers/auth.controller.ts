import {Request, Response} from "express";
import User from "../models/user.model";
import {sendErrorResponse, sendSuccessResponse} from "../utils/ResponseHandlers";
import {CustomError} from "../utils/CustomError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {config} from "../config/config";
import userModel from "../models/user.model";

class AuthController {
    async register(req: Request, res: Response): Promise<Response> {
        try {
            const {firstName, lastName, email, password} = req.body;
            const existingUser: User | null = await User.findOne({where: {email: email}});

            if (existingUser) {
                throw new CustomError("An account exists with this email", CustomError.BAD_REQUEST);
            }

            const user: User = await User.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: await bcrypt.hash(password, config.bcrypt_rounds)
            });

            return sendSuccessResponse(res, user.getBasicInfo(), "Registration successful", 201);
        } catch (err) {
            return sendErrorResponse(res, err);
        }
    }

    async login(req: Request, res: Response): Promise<Response> {
        try {
            const {email, password} = req.body;
            const existingUser: User | null = await User.findOne({where: {email: email}});

            if (!existingUser || !await bcrypt.compare(password, existingUser.password)) {
                throw new CustomError("An account exists with this email", CustomError.BAD_REQUEST);
            }

            const refreshToken: string = existingUser.refreshToken ?? jwt.sign({
                name: existingUser.firstName + ' ' + existingUser.lastName,
                email: existingUser.email
            }, config.jwt_refresh_secret, {expiresIn: "7d", subject: existingUser.id})

            if (!existingUser.refreshToken || existingUser.refreshToken === "") {
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
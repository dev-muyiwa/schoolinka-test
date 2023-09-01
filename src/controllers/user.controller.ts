import {Request, Response} from "express";
import {AuthenticatedRequest} from "../middlewares/authHandler";
import User from "../models/user.model";
import Blog from "../models/blog.model";
import {sendErrorResponse, sendSuccessResponse} from "../utils/ResponseHandlers";
import {CustomError} from "../utils/CustomError";
import jwt, {JwtPayload} from "jsonwebtoken";
import {config} from "../config/config";

class UserController {
    async getUser(req: Request, res: Response) {
        try {
            const {userId} = req.params;
            const user: User|null = await User.findByPk(userId);

            if (!user) {
                throw new CustomError("User does not exist")
            }

            return sendSuccessResponse(res, user.getBasicInfo(), "User fetched");
        } catch (err) {
            return sendErrorResponse(res, err);
        }
    }

    async getDrafts(req: AuthenticatedRequest, res: Response) {
        try {
            const {userId} = req.params

            if (userId != req.user?.id) {
                throw new CustomError("Unable to get drafts", CustomError.FORBIDDEN);
            }
            const user: User|null = await User.findByPk(userId, {
                include: [{
                    model: Blog,
                    as: "blogs",
                    where: {isDraft: true}
                }]
            });

            const drafts = user ? user.blogs : [];

            return sendSuccessResponse(res, drafts, "Drafts fetched");
        } catch (err) {
            return sendErrorResponse(res, err);
        }
    }

    async generateAccessToken(req: Request, res: Response) {
        try {
            const {refreshToken} = req.body;
            const {userId} = req.params;
            const user: User | null = await User.findOne({where: {id: userId, refreshToken: refreshToken}});

            if (!user) {
                throw new CustomError("User does not exist");
            }
            const decodedJwt: JwtPayload = jwt.verify(refreshToken, config.jwt_refresh_secret) as JwtPayload;
            if (user.id !== decodedJwt.sub) {
                throw new CustomError("Invalid refresh token", CustomError.BAD_REQUEST);
            }
            const accessToken: string = jwt.sign({
                name: user.firstName + ' ' + user.lastName,
                email: user.email
            }, config.jwt_access_secret, {expiresIn: "30m", subject: user.id});

            return sendSuccessResponse(res, {accessToken: accessToken}, `Generated access token`, 201);
        } catch (err) {
            return sendErrorResponse(res, err);
        }
    }

    async logout(req: AuthenticatedRequest, res: Response) {
        try {
            const {userId} = req.params;

            if (userId !== req.user?.id) {
                throw new CustomError("Unable to logout", CustomError.FORBIDDEN);
            }

            req.user.refreshToken = null;
            await req.user.save();

            return sendSuccessResponse(res, null, "Logged out")
;        } catch (err) {
            return sendErrorResponse(res, err);
        }
    }
}

export default UserController;
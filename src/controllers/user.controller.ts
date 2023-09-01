import {Request, Response} from "express";
import {AuthenticatedRequest} from "../middlewares/authHandler";
import User from "../models/user.model";
import Blog from "../models/blog.model";
import {sendErrorResponse, sendSuccessResponse} from "../utils/ResponseHandlers";
import {CustomError} from "../utils/CustomError";

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
}

export default UserController;
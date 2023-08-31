import jwt, {JwtPayload} from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {CustomError} from "../utils/CustomError";
import {sendErrorResponse} from "../utils/ResponseHandlers";
import User from "../models/user.model";
import {config} from "../config/config";

interface AuthenticatedRequest extends Request {
    user?: User
}

const checkValidationErrors = (req: Request, res: Response, next: NextFunction): Response | void => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return sendErrorResponse(res, error, "Validation errors.");
    }
    return next();
}

const checkAuthorizationToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        if (!req?.headers?.authorization?.startsWith("Bearer")) {
            throw new CustomError("Bearer token isn't attached to request header.");
        }
        const token: string = req.headers.authorization.split(" ")[1];
        if (!token || token === "") {
            throw new CustomError("Invalid bearer token.", CustomError.BAD_REQUEST);
        }

        const decodedJwt: JwtPayload = jwt.verify(token, config.jwt_access_secret) as JwtPayload;

        const user: User | null = await User.findOne({where: {id: decodedJwt?.sub, email: decodedJwt?.email}})
        if (!user || !user.refreshToken) {
            throw new CustomError(`User attached to this token does not exist.`);
        }

        req.user = user;
        return next()
    } catch (err) {
        return sendErrorResponse(res, err);
    }
}


export {checkValidationErrors, checkAuthorizationToken, AuthenticatedRequest}
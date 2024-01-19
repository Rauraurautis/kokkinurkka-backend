import { NextFunction, Request, Response } from "express";
import { get } from "lodash"
import { NO_REFRESH } from "../constants/errorCodes";
import { reIssueAccessToken } from "../service/session.service";
import { AppError } from "../utils/AppError";
import logger from "../utils/logger";

export const refreshTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies["refreshToken"]
        if (!refreshToken) {
            throw new AppError("Refresh token not found", 400, NO_REFRESH)
        }
        const newToken = await reIssueAccessToken({ refreshToken })
       
        return res.status(200).json({ token: newToken })
    } catch (error: any) {
        return next(error)
    }
}

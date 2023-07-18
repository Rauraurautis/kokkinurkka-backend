import { NextFunction, Request, Response } from "express"
import { NOT_AUTHORIZED } from "../constants/errorCodes"
import { AppError } from "../utils/AppError"

export const requireUser = (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user
    if (!user) {
        throw new AppError("You need to be logged in", 403, NOT_AUTHORIZED)
    }
    return next()
}
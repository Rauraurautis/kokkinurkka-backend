import { NextFunction, Request, Response } from "express"
import { CreateUserInput } from "../schema/user.schema"
import { createUser, getUser } from "../service/user.service"
import { omit } from "lodash"
import { AppError } from "../utils/AppError"
import { ALREADY_EXISTS } from "../constants/errorCodes"

export const createUserHandler = async (req: Request<{}, {}, CreateUserInput["body"]>, res: Response, next: NextFunction) => {
    try {
        const user = await createUser(req.body)
        return res.send(omit(user.toJSON(), "password"))
    } catch (error: any) {
        if (error.code === 11000) {
            next(new AppError("Email or username already exists", 400, ALREADY_EXISTS))
        }
        return next(error)
    }
}

export const getSingleUserHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getUser(req.params.userId, res.locals.user._id)
        return res.send(omit(user?.toJSON(), "password"))
    } catch (error: any) {
        return next(error)
    }
}
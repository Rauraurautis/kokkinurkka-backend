import { NextFunction, Request, Response } from "express"
import { findSessions, updateSession } from "../service/session.service"
import { createUserSession } from "../service/user.service"
import logger from "../utils/logger"


export const createUserSessionHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tokens = await createUserSession(req.body, req.get("user-agent") || "")
        return res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true, sameSite: "strict" })
            .cookie("accessToken", tokens.accessToken, { httpOnly: true, sameSite: "strict" })
            .send({ accessToken: tokens.accessToken })
    } catch (error: any) {
        next(error)
    }
}

export const getUserSessionsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.user._id
        const sessions = await findSessions({ user: userId })
        return res.send(sessions)
    } catch (error: any) {
        logger.error(error)
        return next(error)
    }
}

export const deleteSessionHandler = async (req: Request, res: Response, next: NextFunction) => {
    const sessionId = res.locals.user.session
    await updateSession({ _id: sessionId }, { valid: false })
    return res.send({
        accessToken: null,
        refreshToken: null
    })
}
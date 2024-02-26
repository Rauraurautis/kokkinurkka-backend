import { NextFunction, Request, Response } from "express";
import { get } from "lodash"
import { reIssueAccessToken } from "../service/session.service";
import { verifyJwt } from "../utils/jwt.utils";
import { JwtPayload } from "jsonwebtoken";

export const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies["refreshToken"]
    const accessToken = req.cookies["accessToken"]
    console.log(accessToken)

    if (!accessToken) {
        return next()
    }
    const { decoded, expired } = verifyJwt(accessToken)

    if (decoded) {
        const { user } = decoded as JwtPayload
        res.locals.user = user
        
        return next()
    }

    if (expired && refreshToken) {
        const newAccessToken = await reIssueAccessToken({ refreshToken })
        if (newAccessToken) {
            res.setHeader("x-access-token", newAccessToken)
            res.cookie("accessToken", newAccessToken, { httpOnly: true, sameSite: "strict" })
            const result = verifyJwt(newAccessToken)
            res.locals.user = result.decoded
            return next()
        }
        return next()
    }
    return next()
}
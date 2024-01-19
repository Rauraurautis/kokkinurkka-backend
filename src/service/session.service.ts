import { get, omit } from "lodash"
import { FilterQuery, UpdateQuery } from "mongoose"
import SessionModel, { SessionDocument } from "../models/session.model"
import { signJWT, verifyJwt } from "../utils/jwt.utils"
import { findUser, getUser } from "./user.service"
import { JwtPayload } from "jsonwebtoken"

export const createSession = async (userId: string, userAgent: string) => {
    const session = await SessionModel.create({ user: userId, userAgent })
    return session
}

export const updateSession = async (query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) => {
    return await SessionModel.updateOne(query, update)

}

export const findSessions = async (query: FilterQuery<SessionDocument>) => {
    return await SessionModel.find(query).lean()
}

export const reIssueAccessToken = async ({ refreshToken }: { refreshToken: string }) => {
    const { decoded } = verifyJwt(refreshToken) as JwtPayload
    const userId = get(decoded?.user, "_id")

    if (!decoded || !userId) {
        return false
    }
    const session = await SessionModel.findById(get(decoded, "session"))

    if (!session || !session.valid) return false

    let user = await findUser(session.user)
    

    if (!user) return false

    const accessTokenTtl = "5m"
    const accessToken = signJWT({ user: { email: user.email, name: user.name, _id: user._id }, session: session._id }, { expiresIn: accessTokenTtl })
    return accessToken
}



import { DocumentDefinition, FilterQuery } from "mongoose"
import bcrypt from "bcrypt"
import UserModel, { UserDocument } from "../models/user.model"
import { omit } from "lodash"
import { AppError } from "../utils/AppError"
import { USER_NOT_FOUND } from "../constants/errorCodes"
import { createSession } from "./session.service"
import { signJWT } from "../utils/jwt.utils"
import config from "config"

const accessTokenTtl = config.get<string>("accessTokenTtl") // 15 mins
const refreshTokenTtl = config.get<string>("refreshTokenTtl") // 1 month

export const createUserSession = async (loginDetails: { email: string, password: string }, userAgent: string) => {
    const user = await validatePassword(loginDetails)

    if (!user) {
        throw new AppError("User not found or wrong password", 401, USER_NOT_FOUND)
    }
    
    const session = await createSession(user._id, userAgent)
    const accessToken = signJWT({ user, session: session._id }, { expiresIn: accessTokenTtl })
    const refreshToken = signJWT({ user, session: session._id }, { expiresIn: refreshTokenTtl })

    return { accessToken, refreshToken }
}

export const createUser = async (input: DocumentDefinition<Omit<UserDocument, "createdAt" | "updatedAt" | "comparePassword" | "recipes" | "favorites">>) => {
    const user = await UserModel.create({ ...input, words: [] })
    return omit(user, "password")
}

export const validatePassword = async ({ email, password }: { email: string, password: string }) => {
    const user = await UserModel.findOne({ email })
    if (!user) {
        return false
    }
    const passwordMatch = await user.comparePassword(password)
    if (!passwordMatch) {
        return false
    }
    return omit(user.toJSON(), "password")
}

export const getUser = async (userId: string, user: string) => {
    if (userId !== user) {
        throw new AppError("Users do not match", 403, 310)
    }
    const queriedUser = await UserModel.findById(userId).populate("favorites").populate("recipes")
        .populate({ path: "recipes", populate: { path: "author", model: UserModel, select: "name _id" } })
    return queriedUser
}

export const findUser = async (query: FilterQuery<UserDocument>) => {
    const user = await UserModel.findOne(query).lean()
    return user
}
import { NextFunction, Request, Response } from "express";

export const parseJSON = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = JSON.parse(req.body.recipe)
        req.body = data
        next()
    } catch (error: any) {
        next(error)
    }
}
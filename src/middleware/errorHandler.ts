import { NextFunction, Response, Request } from "express";
import { AppError } from "../utils/AppError";
import multer from "multer";

export const errorHandler = async (error: any, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message, errorCode: error.errorCode })
    }
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).send('File size limit exceeded');
        }
    }

    if (error.name === "ZodError") {
        return res.status(401).json({ error: error.name, issues: error.issues })
    }
    return res.status(400).json({ error: "Something went wrong" })
}
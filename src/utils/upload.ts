import multer, { FileFilterCallback } from "multer"
import { Request } from "express"

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a valid image file'))
        }
        cb(null, true)
    }
})

export default upload
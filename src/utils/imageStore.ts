import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

import dotenv from 'dotenv'
import sharp from "sharp"

dotenv.config()

export const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY || ""
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || ""

const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
})

export const uploadImage = async (file: Express.Multer.File) => {
    try {
        const fileBuffer = await sharp(file.buffer)
            .resize({ height: 250, width: 250, fit: "contain" })
            .toBuffer()

        const uploadParams = {
            Bucket: bucketName,
            Body: fileBuffer,
            Key: file.originalname,
            ContentType: file.mimetype
        }

        await s3Client.send(new PutObjectCommand(uploadParams));

    } catch (error: any) {
        console.error(error)
        throw error
    }
}

export default s3Client
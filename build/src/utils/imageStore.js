"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.bucketName = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
const sharp_1 = __importDefault(require("sharp"));
dotenv_1.default.config();
exports.bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
const s3Client = new client_s3_1.S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
});
const uploadImage = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileBuffer = yield (0, sharp_1.default)(file.buffer)
            .resize({ height: 250, width: 250, fit: "contain" })
            .toBuffer();
        const uploadParams = {
            Bucket: exports.bucketName,
            Body: fileBuffer,
            Key: file.originalname,
            ContentType: file.mimetype
        };
        yield s3Client.send(new client_s3_1.PutObjectCommand(uploadParams));
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
exports.uploadImage = uploadImage;
exports.default = s3Client;

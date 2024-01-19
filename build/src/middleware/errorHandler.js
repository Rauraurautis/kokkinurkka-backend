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
exports.errorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const multer_1 = __importDefault(require("multer"));
const errorHandler = (error, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (error instanceof AppError_1.AppError) {
        return res.status(error.statusCode).json({ error: error.message, errorCode: error.errorCode });
    }
    if (error instanceof multer_1.default.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).send('File size limit exceeded');
        }
    }
    if (error.name === "ZodError") {
        return res.status(401).json({ error: error.name, issues: error.issues });
    }
    return res.status(400).json({ error: "Something went wrong" });
});
exports.errorHandler = errorHandler;

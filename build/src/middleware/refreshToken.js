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
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenHandler = void 0;
const lodash_1 = require("lodash");
const errorCodes_1 = require("../constants/errorCodes");
const session_service_1 = require("../service/session.service");
const AppError_1 = require("../utils/AppError");
const refreshTokenHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = (0, lodash_1.get)(req, "headers.x-refresh");
        if (!refreshToken) {
            throw new AppError_1.AppError("Refresh token not found", 400, errorCodes_1.NO_REFRESH);
        }
        const newToken = yield (0, session_service_1.reIssueAccessToken)({ refreshToken });
        return res.status(200).json({ token: newToken });
    }
    catch (error) {
        return next(error);
    }
});
exports.refreshTokenHandler = refreshTokenHandler;

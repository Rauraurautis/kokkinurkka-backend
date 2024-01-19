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
exports.getSingleUserHandler = exports.createUserHandler = void 0;
const user_service_1 = require("../service/user.service");
const lodash_1 = require("lodash");
const AppError_1 = require("../utils/AppError");
const errorCodes_1 = require("../constants/errorCodes");
const createUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_service_1.createUser)(req.body);
        return res.send((0, lodash_1.omit)(user.toJSON(), "password"));
    }
    catch (error) {
        if (error.code === 11000) {
            next(new AppError_1.AppError("Email or username already exists", 400, errorCodes_1.ALREADY_EXISTS));
        }
        return next(error);
    }
});
exports.createUserHandler = createUserHandler;
const getSingleUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_service_1.getUser)(req.params.userId, res.locals.user._id);
        return res.send((0, lodash_1.omit)(user === null || user === void 0 ? void 0 : user.toJSON(), "password"));
    }
    catch (error) {
        return next(error);
    }
});
exports.getSingleUserHandler = getSingleUserHandler;

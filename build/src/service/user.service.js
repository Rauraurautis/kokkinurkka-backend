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
exports.findUser = exports.getUser = exports.validatePassword = exports.createUser = exports.createUserSession = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const lodash_1 = require("lodash");
const AppError_1 = require("../utils/AppError");
const errorCodes_1 = require("../constants/errorCodes");
const session_service_1 = require("./session.service");
const jwt_utils_1 = require("../utils/jwt.utils");
const config_1 = __importDefault(require("config"));
const accessTokenTtl = config_1.default.get("accessTokenTtl"); // 15 mins
const refreshTokenTtl = config_1.default.get("refreshTokenTtl"); // 1 month
const createUserSession = (loginDetails, userAgent) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.validatePassword)(loginDetails);
    if (!user) {
        throw new AppError_1.AppError("User not found or wrong password", 401, errorCodes_1.USER_NOT_FOUND);
    }
    const session = yield (0, session_service_1.createSession)(user._id, userAgent);
    const accessToken = (0, jwt_utils_1.signJWT)({ user, session: session._id }, { expiresIn: accessTokenTtl });
    const refreshToken = (0, jwt_utils_1.signJWT)({ user, session: session._id }, { expiresIn: refreshTokenTtl });
    return { accessToken, refreshToken };
});
exports.createUserSession = createUserSession;
const createUser = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.create(Object.assign(Object.assign({}, input), { words: [] }));
    return (0, lodash_1.omit)(user, "password");
});
exports.createUser = createUser;
const validatePassword = ({ email, password }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        return false;
    }
    const passwordMatch = yield user.comparePassword(password);
    if (!passwordMatch) {
        return false;
    }
    return (0, lodash_1.omit)(user.toJSON(), "password");
});
exports.validatePassword = validatePassword;
const getUser = (userId, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (userId !== user) {
        console.log(userId, user);
        throw new AppError_1.AppError("Users do not match", 403, 310);
    }
    const queriedUser = yield user_model_1.default.findById(userId).populate("favorites").populate("recipes")
        .populate({ path: "recipes", populate: { path: "author", model: user_model_1.default, select: "name _id" } });
    return queriedUser;
});
exports.getUser = getUser;
const findUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne(query).lean();
    return user;
});
exports.findUser = findUser;

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
exports.deleteSessionHandler = exports.getUserSessionsHandler = exports.createUserSessionHandler = void 0;
const session_service_1 = require("../service/session.service");
const user_service_1 = require("../service/user.service");
const logger_1 = __importDefault(require("../utils/logger"));
const createUserSessionHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokens = yield (0, user_service_1.createUserSession)(req.body, req.get("user-agent") || "");
        return res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true, sameSite: "strict" })
            .cookie("accessToken", tokens.accessToken, { httpOnly: true, sameSite: "strict" })
            .send({ accessToken: tokens.accessToken });
    }
    catch (error) {
        next(error);
    }
});
exports.createUserSessionHandler = createUserSessionHandler;
const getUserSessionsHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.user._id;
        const sessions = yield (0, session_service_1.findSessions)({ user: userId });
        return res.send(sessions);
    }
    catch (error) {
        logger_1.default.error(error);
        return next(error);
    }
});
exports.getUserSessionsHandler = getUserSessionsHandler;
const deleteSessionHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionId = res.locals.user.session;
    yield (0, session_service_1.updateSession)({ _id: sessionId }, { valid: false });
    return res.send({
        accessToken: null,
        refreshToken: null
    });
});
exports.deleteSessionHandler = deleteSessionHandler;

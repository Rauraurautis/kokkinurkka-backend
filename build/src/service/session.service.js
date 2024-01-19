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
exports.reIssueAccessToken = exports.findSessions = exports.updateSession = exports.createSession = void 0;
const lodash_1 = require("lodash");
const session_model_1 = __importDefault(require("../models/session.model"));
const jwt_utils_1 = require("../utils/jwt.utils");
const user_service_1 = require("./user.service");
const config_1 = __importDefault(require("config"));
const createSession = (userId, userAgent) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield session_model_1.default.create({ user: userId, userAgent });
    return session;
});
exports.createSession = createSession;
const updateSession = (query, update) => __awaiter(void 0, void 0, void 0, function* () {
    return yield session_model_1.default.updateOne(query, update);
});
exports.updateSession = updateSession;
const findSessions = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield session_model_1.default.find(query).lean();
});
exports.findSessions = findSessions;
const reIssueAccessToken = ({ refreshToken }) => __awaiter(void 0, void 0, void 0, function* () {
    const { decoded } = (0, jwt_utils_1.verifyJwt)(refreshToken);
    const userId = (0, lodash_1.get)(decoded, "_id");
    if (!decoded || !userId)
        return false;
    const session = yield session_model_1.default.findById((0, lodash_1.get)(decoded, "session"));
    if (!session || !session.valid)
        return false;
    let user = yield (0, user_service_1.findUser)(session.user);
    if (!user)
        return false;
    const accessTokenTtl = config_1.default.get("accessTokenTtl");
    const accessToken = (0, jwt_utils_1.signJWT)(Object.assign(Object.assign({}, user), { session: session._id }), { expiresIn: accessTokenTtl });
    return accessToken;
});
exports.reIssueAccessToken = reIssueAccessToken;

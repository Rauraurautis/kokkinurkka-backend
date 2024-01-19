"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.signJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PUBLIC_KEY;
const signJWT = (object, options) => {
    return jsonwebtoken_1.default.sign(object, privateKey, Object.assign(Object.assign({}, (options && options)), { algorithm: "RS256" }));
};
exports.signJWT = signJWT;
const verifyJwt = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, publicKey);
        return {
            valid: true,
            expired: false,
            decoded
        };
    }
    catch (error) {
        return {
            valid: false,
            expired: error.message === "jwt expired",
            decoded: null
        };
    }
};
exports.verifyJwt = verifyJwt;

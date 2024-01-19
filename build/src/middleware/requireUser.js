"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireUser = void 0;
const errorCodes_1 = require("../constants/errorCodes");
const AppError_1 = require("../utils/AppError");
const requireUser = (req, res, next) => {
    const user = res.locals.user;
    console.log(user);
    if (!user) {
        throw new AppError_1.AppError("You need to be logged in", 403, errorCodes_1.NOT_AUTHORIZED);
    }
    return next();
};
exports.requireUser = requireUser;

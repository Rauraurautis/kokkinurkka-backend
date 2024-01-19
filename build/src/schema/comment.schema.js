"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommentSchema = void 0;
const zod_1 = require("zod");
exports.createCommentSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        content: (0, zod_1.string)({
            required_error: "Need to add content"
        }).min(10, "Too short of a comment - minimum 10 characters!"),
    })
});

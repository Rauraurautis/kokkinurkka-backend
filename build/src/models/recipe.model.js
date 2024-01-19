"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = exports.recipeSchema = exports.commentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.commentSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date },
    content: { type: String, required: true }
}, {
    versionKey: false, timestamps: true
});
const ingredientSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    unit: { type: String, required: true }
}, {
    versionKey: false, timestamps: true
});
exports.recipeSchema = new mongoose_1.default.Schema({
    author: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: false },
    instructions: { type: String, required: true },
    category: { type: String, required: true },
    ingredients: [ingredientSchema],
    comments: [exports.commentSchema],
    favoritedBy: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }]
}, {
    versionKey: false, timestamps: true
});
exports.CommentModel = mongoose_1.default.model("Comment", exports.commentSchema);
const RecipeModel = mongoose_1.default.model("Recipe", exports.recipeSchema);
exports.default = RecipeModel;

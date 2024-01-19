"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.favoriteRecipe = exports.deleteComment = exports.commentRecipe = exports.getAllRecipes = exports.deleteRecipe = exports.getSingleRecipe = exports.addRecipe = void 0;
const errorCodes_1 = require("../constants/errorCodes");
const recipe_model_1 = __importStar(require("../models/recipe.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const AppError_1 = require("../utils/AppError");
const imageStore_1 = require("../utils/imageStore");
const addRecipe = (input, userId, picture) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ _id: userId });
    if (user) {
        const recipe = yield recipe_model_1.default.create(Object.assign(Object.assign({}, input), { author: userId }));
        if (picture) {
            picture.originalname = `${recipe.id}.${picture.mimetype.split("/")[1]}`;
            yield (0, imageStore_1.uploadImage)(picture);
            recipe.image = picture.originalname.toString();
            yield recipe.save();
        }
        user.recipes = user.recipes.concat(recipe._id);
        yield user.save();
        return recipe;
    }
});
exports.addRecipe = addRecipe;
const getSingleRecipe = (recipeId) => __awaiter(void 0, void 0, void 0, function* () {
    if (recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        const recipe = yield recipe_model_1.default.findById({ _id: recipeId });
        if (!recipe) {
            throw new AppError_1.AppError("No recipe found with that id", 404, errorCodes_1.NOT_FOUND_RECIPE);
        }
        return recipe;
    }
    else {
        throw new AppError_1.AppError("Incorrect recipeId format", 404, errorCodes_1.INCORRECT_FORMAT);
    }
});
exports.getSingleRecipe = getSingleRecipe;
const deleteRecipe = (recipeId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const recipe = yield (0, exports.getSingleRecipe)(recipeId);
    if (recipe) {
        if (recipe.author.equals(user)) {
            yield recipe.remove();
            return { message: `Recipe ${recipeId} has been removed` };
        }
        else {
            throw new AppError_1.AppError("User not authorized to remove recipe", 403, errorCodes_1.NOT_AUTHORIZED);
        }
    }
});
exports.deleteRecipe = deleteRecipe;
const getAllRecipes = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield recipe_model_1.default.find({}, { favoritedBy: 0 })
        .populate("author", { name: 1, _id: 1 })
        .populate({ path: "comments", populate: { path: "user", model: user_model_1.default, select: "name _id" } });
});
exports.getAllRecipes = getAllRecipes;
const commentRecipe = (input, user) => __awaiter(void 0, void 0, void 0, function* () {
    const recipe = yield (0, exports.getSingleRecipe)(input.recipeId);
    const comment = new recipe_model_1.CommentModel({ content: input.content, user: user });
    recipe.comments.push(comment);
    yield recipe.save();
    return recipe;
});
exports.commentRecipe = commentRecipe;
const deleteComment = (recipeId, commentId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const recipe = yield (0, exports.getSingleRecipe)(recipeId);
    if (recipe) {
        const comment = recipe.comments.filter(comment => comment._id.equals(commentId))[0];
        if (comment.user.equals(user)) {
            const modifiedComments = recipe.comments.filter(comment => !comment._id.equals(commentId));
            yield recipe_model_1.default.updateOne({ _id: recipeId }, { $set: { comments: modifiedComments } });
            return { message: "Comment removed" };
        }
        else {
            throw new AppError_1.AppError("User not authorized to remove comment", 403, errorCodes_1.NOT_AUTHORIZED);
        }
    }
});
exports.deleteComment = deleteComment;
const favoriteRecipe = (recipeId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ _id: userId });
    if (user) {
        const recipe = yield (0, exports.getSingleRecipe)(recipeId);
        if (user.favorites.filter(recipe => recipe._id.equals(recipeId)).length > 0) {
            user.favorites = user.favorites.filter(prev => !prev._id.equals(recipe._id));
            recipe.favoritedBy = recipe.favoritedBy.filter(prev => !prev._id.equals(user._id));
            yield user.save();
            yield recipe.save();
            return user;
        }
        user.favorites = user.favorites.concat(recipe);
        yield user.save();
        recipe.favoritedBy.push(user._id);
        yield recipe.save();
        return user;
    }
    throw new Error();
});
exports.favoriteRecipe = favoriteRecipe;

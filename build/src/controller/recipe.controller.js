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
exports.favoriteRecipeHandler = exports.deleteCommentHandler = exports.commentRecipeHandler = exports.getSingleRecipeHandler = exports.getAllRecipesHandler = exports.deleteRecipeHandler = exports.createRecipeHandler = void 0;
const recipe_service_1 = require("../service/recipe.service");
const AppError_1 = require("../utils/AppError");
const logger_1 = __importDefault(require("../utils/logger"));
const createRecipeHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.user._id;
        req.body.image = "";
        const recipe = yield (0, recipe_service_1.addRecipe)(req.body, user, req.file);
        return res.status(201).send(recipe);
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
});
exports.createRecipeHandler = createRecipeHandler;
const deleteRecipeHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.user._id;
        const recipe = yield (0, recipe_service_1.deleteRecipe)(req.params.recipeId, user);
        return res.status(201).send(recipe);
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
});
exports.deleteRecipeHandler = deleteRecipeHandler;
const getAllRecipesHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipes = yield (0, recipe_service_1.getAllRecipes)();
        return res.status(200).send(recipes);
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
});
exports.getAllRecipesHandler = getAllRecipesHandler;
const getSingleRecipeHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipe = yield (0, recipe_service_1.getSingleRecipe)(req.params.recipeId);
        if (!recipe) {
            throw new AppError_1.AppError("No recipe found with that id", 404, 302);
        }
        return res.status(200).send(recipe);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.getSingleRecipeHandler = getSingleRecipeHandler;
const commentRecipeHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.user._id;
        const recipeId = req.params.recipeId;
        const recipe = yield (0, recipe_service_1.commentRecipe)(Object.assign(Object.assign({}, req.body), { recipeId }), user);
        return res.status(200).send(recipe);
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
});
exports.commentRecipeHandler = commentRecipeHandler;
const deleteCommentHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("asdasd");
        const user = res.locals.user._id;
        const recipeId = req.params.recipeId;
        const commentId = req.body.commentId;
        const recipe = yield (0, recipe_service_1.deleteComment)(recipeId, commentId, user);
        return res.status(200).send(recipe);
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
});
exports.deleteCommentHandler = deleteCommentHandler;
const favoriteRecipeHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.user._id;
        const recipeId = req.params.recipeId;
        const returnedUser = yield (0, recipe_service_1.favoriteRecipe)(recipeId, user);
        return res.status(200).send(returnedUser);
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
});
exports.favoriteRecipeHandler = favoriteRecipeHandler;

import { NextFunction, Request, Response } from "express";
import { addRecipe, commentRecipe, deleteComment, deleteRecipe, favoriteRecipe, getAllRecipes, getSingleRecipe } from "../service/recipe.service";
import { AppError } from "../utils/AppError";
import logger from "../utils/logger";

export const createRecipeHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user._id
        req.body.image = ""
        const recipe = await addRecipe(req.body, user, req.file as Express.Multer.File)
        return res.status(201).send(recipe)
    } catch (error: any) {
        logger.error(error)
        next(error)
    }
}

export const deleteRecipeHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user._id
        const recipe = await deleteRecipe(req.params.recipeId, user)
        return res.status(201).send(recipe)
    } catch (error: any) {
        logger.error(error)
        next(error)
    }
}

export const getAllRecipesHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recipes = await getAllRecipes()
        return res.status(200).send(recipes)
    } catch (error: any) {
        logger.error(error)
        next(error)
    }
}

export const getSingleRecipeHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recipe = await getSingleRecipe(req.params.recipeId)
        if (!recipe) {
            throw new AppError("No recipe found with that id", 404, 302)
        }
        return res.status(200).send(recipe)
    } catch (error: any) {
        console.log(error)
        next(error)
    }
}

export const commentRecipeHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user._id
        const recipeId = req.params.recipeId
        const recipe = await commentRecipe({ ...req.body, recipeId }, user)
        return res.status(200).send(recipe)
    } catch (error: any) {
        logger.error(error)
        next(error)
    }
}

export const deleteCommentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("asdasd")
        const user = res.locals.user._id
        const recipeId = req.params.recipeId
        const commentId = req.body.commentId
        const recipe = await deleteComment(recipeId, commentId, user)
        return res.status(200).send(recipe)
    } catch (error: any) {
        logger.error(error)
        next(error)
    }
}

export const favoriteRecipeHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user._id
        const recipeId = req.params.recipeId
        const returnedUser = await favoriteRecipe(recipeId, user)
        return res.status(200).send(returnedUser)
    } catch (error: any) {
        logger.error(error)
        next(error)
    }
}
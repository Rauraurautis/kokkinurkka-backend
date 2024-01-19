import { DocumentDefinition } from "mongoose";
import { INCORRECT_FORMAT, NOT_AUTHORIZED, NOT_FOUND_RECIPE } from "../constants/errorCodes";
import RecipeModel, { CommentDocument, CommentInput, CommentModel, RecipeDocument } from "../models/recipe.model";
import UserModel from "../models/user.model";
import { AppError } from "../utils/AppError";
import s3Client, { bucketName, uploadImage } from "../utils/imageStore";

export const addRecipe = async (input: DocumentDefinition<Omit<RecipeDocument, "createdAt" | "updatedAt" | "author" | "comments" | "favoritedBy">>, userId: string, picture: Express.Multer.File) => {
    const user = await UserModel.findOne({ _id: userId })
    if (user) {
        const recipe = await RecipeModel.create({ ...input, author: userId })
        if (picture) {
            picture.originalname = `${recipe.id}.${picture.mimetype.split("/")[1]}`
            await uploadImage(picture)
            recipe.image = picture.originalname.toString()
            await recipe.save()
        }
        user.recipes = user.recipes.concat(recipe._id)
        await user.save()
        return recipe
    }

}

export const getSingleRecipe = async (recipeId: string) => {
    if (recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        const recipe = await RecipeModel.findById({ _id: recipeId })
        if (!recipe) {
            throw new AppError("No recipe found with that id", 404, NOT_FOUND_RECIPE)
        }
        return recipe
    } else {
        throw new AppError("Incorrect recipeId format", 404, INCORRECT_FORMAT)
    }
}

export const deleteRecipe = async (recipeId: string, user: string) => {
    const recipe = await getSingleRecipe(recipeId)
    if (recipe) {
        if (recipe.author.equals(user)) {
            await recipe.remove()
            return { message: `Recipe ${recipeId} has been removed` }
        } else {
            throw new AppError("User not authorized to remove recipe", 403, NOT_AUTHORIZED)
        }
    }
}

export const getAllRecipes = async () => {
    return await RecipeModel.find({})
        .populate("author", { name: 1, _id: 1 })
        .populate({ path: "comments", populate: { path: "user", model: UserModel, select: "name _id" } })
}


export const commentRecipe = async (input: { content: string, recipeId: string }, user: string) => {
    const recipe = await getSingleRecipe(input.recipeId)
    const comment = new CommentModel({ content: input.content, user: user })
    recipe.comments.push(comment)
    await recipe.save()
    return recipe
}

export const deleteComment = async (recipeId: string, commentId: string, user: string) => {
    const recipe = await getSingleRecipe(recipeId)
    if (recipe) {
        const comment: CommentDocument = recipe.comments.filter(comment => comment._id.equals(commentId))[0]
        if (comment.user.equals(user)) {
            const modifiedComments = recipe.comments.filter(comment => !comment._id.equals(commentId))
            await RecipeModel.updateOne({ _id: recipeId }, { $set: { comments: modifiedComments } })
            return { message: "Comment removed" }
        } else {
            throw new AppError("User not authorized to remove comment", 403, NOT_AUTHORIZED)
        }
    }
}

export const favoriteRecipe = async (recipeId: string, userId: string) => {
    const user = await UserModel.findOne({ _id: userId })
    if (user) {
        const recipe = await getSingleRecipe(recipeId)
        if (user.favorites.filter(recipe => recipe._id.equals(recipeId)).length > 0) {
            user.favorites = user.favorites.filter(prev => !prev._id.equals(recipe._id))
            recipe.favoritedBy = recipe.favoritedBy.filter(prev => !prev._id.equals(user._id))
            await user.save()
            await recipe.save()
            return user
        }
        user.favorites = user.favorites.concat(recipe)
        await user.save()
        recipe.favoritedBy.push(user._id)
        await recipe.save()
        return user
    }
    throw new Error()
}
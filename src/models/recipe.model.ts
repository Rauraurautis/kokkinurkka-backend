import mongoose from "mongoose";
import { UserDocument } from "./user.model";

export interface Ingredient {
    name: string
    amount: number
    unit: string
}

export interface CommentInput {
    content: string
}

export interface CommentDocument extends mongoose.Document, CommentInput {
    user: UserDocument["id"]
    createdAt: Date
    content: string
}

export type Category = "alkupalat" | "pääruoat" | "keitot" | "juomat" | "pizzat" | "leivonnaiset" | "lisukkeet" | "leivät"
    | "salaatit" | "välipalat" | "kastikkeet" | "jälkiruoat"

export interface RecipeInput {
    name: string
    description: string
    ingredients: Ingredient[]
    instructions: string
    category: Category
    image?: string
}

export interface RecipeDocument extends mongoose.Document, RecipeInput {
    author: UserDocument["id"]
    favoritedBy: UserDocument["id"][]
    comments: CommentDocument[]
    createdAt: Date
    updatedAt: Date
}

export const commentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date },
        content: { type: String, required: true }
    },
    {
        versionKey: false, timestamps: true
    }
)

const ingredientSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        unit: { type: String, required: true }
    },
    {
        versionKey: false, timestamps: true
    }
)

export const recipeSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: false },
        instructions: { type: String, required: true },
        category: { type: String, required: true },
        ingredients: [ingredientSchema],
        comments: [commentSchema],
        favoritedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
    },
    {
        versionKey: false, timestamps: true
    }
)

export const CommentModel = mongoose.model<CommentDocument>("Comment", commentSchema)
const RecipeModel = mongoose.model<RecipeDocument>("Recipe", recipeSchema)


export default RecipeModel
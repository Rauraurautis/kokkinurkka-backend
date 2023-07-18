import mongoose from "mongoose";
import bcrypt from "bcrypt"
import config from "config"
import { RecipeDocument } from "./recipe.model";

export interface UserInput {
    email: string;
    name: string;
    password: string;
}



export interface UserDocument extends UserInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<Boolean>;
    recipes: RecipeDocument[]
    favorites: RecipeDocument[]
}


const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
        favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }]
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {

    // @ts-ignore
    let user = this as UserDocument
    if (!user.isModified("password")) {
        return next()
    }

    const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"))
    const hash = await bcrypt.hashSync(user.password, salt)
    user.password = hash
    return next()
})

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const user = this as UserDocument

    const passwordComparison = await bcrypt.compare(candidatePassword, user.password)
    return passwordComparison
}

const UserModel = mongoose.model<UserDocument>("User", userSchema)

export default UserModel
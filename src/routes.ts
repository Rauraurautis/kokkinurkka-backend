import { Express, Request, Response } from "express"
import { commentRecipeHandler, createRecipeHandler, deleteCommentHandler, deleteRecipeHandler, favoriteRecipeHandler, getAllRecipesHandler, getSingleRecipeHandler } from "./controller/recipe.controller"
import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler } from "./controller/session.controller"
import { createUserHandler, getSingleUserHandler } from "./controller/user.controller"
import { refreshTokenHandler } from "./middleware/refreshToken"
import { requireUser } from "./middleware/requireUser"
import validateResource from "./middleware/validateResource"
import { createCommentSchema } from "./schema/comment.schema"
import { createRecipeSchema } from "./schema/recipe.schema"
import { createSessionSchema } from "./schema/session.schema"
import { createUserSchema } from "./schema/user.schema"
import { multerConfig } from "../multer-config"
import { parseJSON } from "./middleware/parseJson"
import upload from "./utils/upload"
import path from "path"
import fs from "fs"

const getImageHandler = async (req: Request, res: Response) => {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, 'images', filename);

    // Read the image file and send it as JSON
    fs.readFile(imagePath, (err: any, data: any) => {
        if (err) {
            console.log(err);
            res.status(400).send('Error reading the image file');
        } else {
            res.setHeader('Content-Type', 'image/jpeg'); // Set the appropriate content-type header
            res.send(data);
        }
    });
}

const routes = (app: Express) => {
    app.get("/healthcheck", (req: Request, res: Response) => {
        res.status(200).json({ status: "OK" })
    })

    app.post("/api/sessions", validateResource(createSessionSchema), createUserSessionHandler)
    app.get("/api/sessions", requireUser, getUserSessionsHandler)
    app.delete("/api/sessions", requireUser, deleteSessionHandler)
    app.get("/refresh", refreshTokenHandler)

    app.get("/image/:filename", getImageHandler)

    app.post("/api/users", validateResource(createUserSchema), createUserHandler)
    app.get("/api/users/:userId", requireUser, getSingleUserHandler)

    app.post("/api/recipes", requireUser, upload.single("image"), parseJSON, validateResource(createRecipeSchema), createRecipeHandler)
    app.delete("/api/recipes/:recipeId", requireUser, deleteRecipeHandler)

    app.post("/api/recipes/:recipeId", requireUser, validateResource(createCommentSchema), commentRecipeHandler)
    app.put("/api/recipes/:recipeId", requireUser, deleteCommentHandler)

    app.get("/api/recipes", getAllRecipesHandler)
    app.get("/api/recipes/:recipeId", getSingleRecipeHandler)

    app.put("/api/recipes/favorite/:recipeId", requireUser, favoriteRecipeHandler)

}

export default routes
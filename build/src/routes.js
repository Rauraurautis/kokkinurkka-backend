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
const recipe_controller_1 = require("./controller/recipe.controller");
const session_controller_1 = require("./controller/session.controller");
const user_controller_1 = require("./controller/user.controller");
const refreshToken_1 = require("./middleware/refreshToken");
const requireUser_1 = require("./middleware/requireUser");
const validateResource_1 = __importDefault(require("./middleware/validateResource"));
const comment_schema_1 = require("./schema/comment.schema");
const recipe_schema_1 = require("./schema/recipe.schema");
const session_schema_1 = require("./schema/session.schema");
const user_schema_1 = require("./schema/user.schema");
const parseJson_1 = require("./middleware/parseJson");
const upload_1 = __importDefault(require("./utils/upload"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const getImageHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename } = req.params;
    const imagePath = path_1.default.join(__dirname, 'images', filename);
    // Read the image file and send it as JSON
    fs_1.default.readFile(imagePath, (err, data) => {
        if (err) {
            console.log(err);
            res.status(400).send('Error reading the image file');
        }
        else {
            res.setHeader('Content-Type', 'image/jpeg'); // Set the appropriate content-type header
            res.send(data);
        }
    });
});
const routes = (app) => {
    app.get("/healthcheck", (req, res) => {
        res.status(200).json({ status: "OK" });
    });
    app.get("/csrf-token", (req, res) => {
        res.cookie("asd", "asd", { sameSite: "strict" });
        res.json({ csrfToken: req.csrfToken() });
    });
    app.post("/api/sessions", (0, validateResource_1.default)(session_schema_1.createSessionSchema), session_controller_1.createUserSessionHandler);
    app.get("/api/sessions", requireUser_1.requireUser, session_controller_1.getUserSessionsHandler);
    app.delete("/api/sessions", requireUser_1.requireUser, session_controller_1.deleteSessionHandler);
    app.get("/refresh", refreshToken_1.refreshTokenHandler);
    app.get("/image/:filename", getImageHandler);
    app.post("/api/users", (0, validateResource_1.default)(user_schema_1.createUserSchema), user_controller_1.createUserHandler);
    app.get("/api/users/:userId", requireUser_1.requireUser, user_controller_1.getSingleUserHandler);
    app.post("/api/recipes", requireUser_1.requireUser, upload_1.default.single("image"), parseJson_1.parseJSON, (0, validateResource_1.default)(recipe_schema_1.createRecipeSchema), recipe_controller_1.createRecipeHandler);
    app.delete("/api/recipes/:recipeId", requireUser_1.requireUser, recipe_controller_1.deleteRecipeHandler);
    app.post("/api/recipes/:recipeId", requireUser_1.requireUser, (0, validateResource_1.default)(comment_schema_1.createCommentSchema), recipe_controller_1.commentRecipeHandler);
    app.put("/api/recipes/:recipeId", requireUser_1.requireUser, recipe_controller_1.deleteCommentHandler);
    app.get("/api/recipes", recipe_controller_1.getAllRecipesHandler);
    app.get("/api/recipes/:recipeId", recipe_controller_1.getSingleRecipeHandler);
    app.put("/api/recipes/favorite/:recipeId", requireUser_1.requireUser, recipe_controller_1.favoriteRecipeHandler);
};
exports.default = routes;

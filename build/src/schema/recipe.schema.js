"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRecipeSchema = void 0;
const zod_1 = require("zod");
const ingredientSchema = (0, zod_1.object)({
    name: (0, zod_1.string)({
        required_error: "Name is required"
    }),
    amount: (0, zod_1.number)({
        required_error: "Amount is required"
    }),
    unit: (0, zod_1.string)({
        required_error: "Unit is required"
    })
});
exports.createRecipeSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({
            required_error: "Name is required"
        }).min(2, "Too short of a name - minimum 6 letters"),
        description: (0, zod_1.string)({
            required_error: "Description is required"
        }).min(2, "Too short of a description - minimum 10 letters"),
        instructions: (0, zod_1.string)({
            required_error: "Instructions are required"
        }).min(2, "Too short instructions - minimum 10 letters"),
        ingredients: (0, zod_1.array)(ingredientSchema, ({ required_error: "Ingredients are required" })),
        category: (0, zod_1.string)().refine((val) => {
            const validCategories = [
                "alkupalat",
                "pääruoat",
                "keitot",
                "juomat",
                "pizzat",
                "leivonnaiset",
                "lisukkeet",
                "leivät",
                "salaatit",
                "välipalat",
                "kastikkeet",
                "jälkiruoat",
            ];
            return validCategories.includes(val);
        }, {
            message: "Invalid category"
        })
    })
});

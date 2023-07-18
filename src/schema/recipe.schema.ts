import { object, string, TypeOf, array, number } from "zod"


const ingredientSchema = object({
    name: string({
        required_error: "Name is required"
    }),
    amount: number({
        required_error: "Amount is required"
    }),
    unit: string({
        required_error: "Unit is required"
    })
})

export const createRecipeSchema = object({
    body: object({
        name: string({
            required_error: "Name is required"
        }).min(2, "Too short of a name - minimum 6 letters"),
        description: string({
            required_error: "Description is required"
        }).min(2, "Too short of a description - minimum 10 letters"),
        instructions: string({
            required_error: "Instructions are required"
        }).min(2, "Too short instructions - minimum 10 letters"),
        ingredients: array(ingredientSchema,
            ({ required_error: "Ingredients are required" })),
        category: string().refine((val) => {
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
})

export type CreateRecipeInput = TypeOf<typeof createRecipeSchema>
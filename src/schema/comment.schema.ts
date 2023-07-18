import { object, string, TypeOf, array, number } from "zod"



export const createCommentSchema = object({
    body: object({
        content: string({
            required_error: "Need to add content"
        }).min(10, "Too short of a comment - minimum 10 characters!"),

    })
})

export type CreateCommentInput = TypeOf<typeof createCommentSchema>
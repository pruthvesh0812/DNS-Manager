import {z} from 'zod'

export const authInputSchema = z.object({
    email:z.string().min(5),
    password:z.string().min(8).max(20)
})
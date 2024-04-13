import { z, ZodType } from "zod";

export class UserValidation {
    public static REGISTER: ZodType = z.object({
        username: z.coerce.string().min(1).max(100),
        password: z.coerce.string().min(1).max(100),
        name    : z.coerce.string().min(1).max(100)
    });
    public static LOGIN: ZodType = z.object({
        username: z.coerce.string().min(1).max(100),
        password: z.coerce.string().min(1).max(100),
    });
    public static UPDATE: ZodType = z.object({
        name: z.coerce.string().min(1).max(100).optional(),
        password: z.coerce.string().min(1).max(100).optional()
    })
}
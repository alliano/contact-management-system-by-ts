import { z, ZodType } from "zod";

export class ContactValidation {
    public static readonly CREATE: ZodType = z.object({
        first_name: z.coerce.string().min(1).max(100),
        last_name : z.coerce.string().min(1).max(100).optional(),
        email     : z.coerce.string().email().min(1).max(100).optional(),
        phone     : z.coerce.string().min(1).max(20).optional(),
    })
    public static readonly UPDATE: ZodType = z.object({
        id        : z.coerce.number().positive(),
        first_name: z.coerce.string().min(1).max(100),
        last_name : z.coerce.string().min(1).max(100).optional(),
        email     : z.coerce.string().email().min(1).max(100).optional(),
        phone     : z.coerce.string().min(1).max(20).optional(),
    })
    public static readonly SEARCH: ZodType = z.object({
        name    : z.coerce.string().min(1).optional(),
        phone   : z.coerce.string().min(1).optional(),
        email   : z.coerce.string().email().min(1).optional(),
        page    : z.coerce.number().positive(),
        size    : z.coerce.number().positive()
    })
}
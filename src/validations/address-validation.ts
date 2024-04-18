import { z, ZodType } from "zod";

export class AddressValidation {
    public static readonly CREATE: ZodType = z.object({
        contact_id  : z.coerce.number().positive(),
        street      : z.coerce.string().min(1).max(255).optional(),
        city        : z.coerce.string().min(1).max(100).optional(),
        province    : z.coerce.string().min(1).max(100).optional(),
        country     : z.coerce.string().min(1).max(100).optional(),
        postal_code : z.coerce.string().min(1).max(10)
    });
    public static readonly GET: ZodType = z.object({
        contact_id : z.coerce.number().positive(),
        id         : z.coerce.number().positive()
    });
    public static readonly DELETE: ZodType = z.object({
        contact_id : z.coerce.number().positive(),
        id         : z.coerce.number().positive()
    });
    public static readonly UPDATE: ZodType = z.object({
        id          : z.coerce.number().positive(),
        contact_id  : z.coerce.number().positive(),
        street      : z.coerce.string().min(1).max(255).optional(),
        city        : z.coerce.string().min(1).max(100).optional(),
        province    : z.coerce.string().min(1).max(100).optional(),
        country     : z.coerce.string().min(1).max(100).optional(),
        postal_code : z.coerce.string().min(1).max(10)
        
    })
}
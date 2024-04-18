import { NextFunction, Request, Response } from "express";
import { connection } from "../application/databases";
import { UserRequest } from "../types/user-request";

export const authMiddleware = async(req: UserRequest, resp: Response, next: NextFunction): Promise<void> => {
    console.log(req.body);
    const token: string | undefined = req.get("X-API-TOKEN");
    if(token !== undefined) {
        const user = await connection.user.findFirst({
            where: {
                token: token
            }
        })

        if(user){
            req.user = user;
            next();
            return;
        }
    }
    resp.status(401).json({
        errors: "Unautorized",
        data: "GTW"
    }).end();
}
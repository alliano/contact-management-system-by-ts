import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ErrorResponse } from "../errors/error-response";

export const errorMiddleware = async (error: Error, req: Request, resp: Response, next: NextFunction) => {
    if(error instanceof ZodError) resp.status(400).json({
        error: `Validation Error ${JSON.stringify(error)}`
    })
        else
    if(error instanceof ErrorResponse) resp.status(401).json({
        errors: error.message
    })
        else
    resp.status(500).json({
        errors: error.message,
    })
}
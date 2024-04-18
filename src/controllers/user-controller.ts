import { NextFunction, Request, Response } from "express";
import { CreateUserRequest, LoginUserRequest, updateUserRequest, UserResponse } from "../models/user-models";
import { UserService } from "../services/user-service";
import { UserRequest } from "../types/user-request";

export class UserController {
    public static async register(req: Request, resp: Response, next: NextFunction): Promise<void> {
        try{
            const request: CreateUserRequest = req.body as CreateUserRequest;
            console.log(request);
            
            const response: UserResponse = await UserService.register(request);
            resp.status(201).json({
                data: response
            });
        }catch(e){
            next(e);
        }
    }
    public static async login(req: Request, resp: Response, next: NextFunction): Promise<void> {
        try {
            const request: LoginUserRequest = req.body as LoginUserRequest;
            const response: UserResponse = await UserService.login(request);
            resp.status(200).json({
                data: response
            })
        }catch(e) {
            next(e);
        }
    }
    public static async get(req: UserRequest, resp: Response, next: NextFunction): Promise<void> {
        try{
            const response: UserResponse = await UserService.get(req.user!);
            resp.status(200).json({
                data: response
            })
        }catch(e) {
            next(e);
        }
    }
    public static async update(req: UserRequest, resp: Response, next: NextFunction): Promise<void> {
        try{
            const updateRequest: updateUserRequest = req.body as updateUserRequest;
            const response: UserResponse = await UserService.update(req.user!, updateRequest);
            resp.status(200).json({
                data: response
            })
        }catch(e) {
            next(e)
        }
    }
    public static async logout(req: UserRequest, resp: Response, next: NextFunction): Promise<void> {
        try {
            const response: string = await UserService.logout(req.user!);
            resp.status(200)
                .json({
                    data: response
                });
        }catch(e) {
            next(e);
        }
    }
}
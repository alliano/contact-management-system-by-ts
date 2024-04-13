import { User } from "@prisma/client";
import { connection } from "../application/databases";
import { CreateUserRequest, LoginUserRequest, toUserResponse, updateUserRequest, UserResponse } from "../models/user-models";
import { UserValidation } from "../validations/user-validations";
import { Validation } from "../validations/validation";
import { ErrorResponse } from "../errors/error-response";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export class UserService {
    public static async register(request: CreateUserRequest): Promise<UserResponse> {
        const registerRequest = Validation.validate(UserValidation.REGISTER, request);
        const totalUserWithSameUsername: number = await connection.user.count({
            where: {
                username: registerRequest.username
            }
        })
        if(totalUserWithSameUsername !== 0) throw new ErrorResponse(400, `Username with ${registerRequest.username} already use, please choose another username!`);
        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
        const user: User = await connection.user.create({
            data: registerRequest
        })
        return toUserResponse(user)
    }
    public static async login(request: LoginUserRequest): Promise<UserResponse> {
        
        const loginRequest = Validation.validate(UserValidation.LOGIN, request);
        const userExist: User | null  = await connection.user.findUnique({
            where: {
                username: loginRequest.username
            }
        })
        if(!userExist) throw new ErrorResponse(401, `user with ${loginRequest.username} does not exist!`);
        const isValidPassword: boolean = await bcrypt.compare(loginRequest.password, userExist.password);
        if(!isValidPassword) throw new ErrorResponse(401, `username or password wrong!`);
        const user: User = await connection.user.update({
            where: {
                username: loginRequest.username
            },
            data: {
                token: uuid()  
            }
        })
        const response: UserResponse = toUserResponse(user);
        response.token = user.token!;
        return response;
    }
    public static async get(user: User): Promise<UserResponse> {
        return toUserResponse(user);
    }
    public static async update(user: User, updateRequest: updateUserRequest): Promise<UserResponse> {
        const updateUserRequest = Validation.validate(UserValidation.UPDATE, updateRequest);
        if(updateRequest.name) user.name = updateRequest.name;
        if(updateRequest.password) user.password = await bcrypt.hash(updateRequest.password, 10)
        const result = await connection.user.update({
            where: {
                username: user.username
            },
             data: user
        });
        return toUserResponse(result);
    }
    public static async logout(user: User): Promise<string> {
        const result: User = await connection.user.update({
            data: {
                token: null
            },
            where: {
                username: user.username
            }
        });
        return "OK";
    }
}
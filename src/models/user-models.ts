import { User } from "@prisma/client";

export type CreateUserRequest  = {
    username: string;
    name    : string;
    password: string;
}
export type UserResponse = {
    username: string;
    name    : string;
    token?  : string;
}
export type LoginUserRequest = {
    username: string;
    password: string;
}
export const toUserResponse = (user: User) => { 
    return {
        name    : user.name,
        username: user.username
    }
}
export type updateUserRequest = {
    name?    : string;
    password?: string;
}

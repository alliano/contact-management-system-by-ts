import { Router } from "express";
import express from "express";
import { UserController } from "../controllers/user-controller";

export const publicRouter: Router = express.Router();
publicRouter.post("/api/users", UserController.register);
publicRouter.post("/api/users/login", UserController.login)
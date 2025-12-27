import { Router } from "express";
import UserController from "./user.controller.js";
import UserService from "./user.service.js";
import UserRepository from "./user.repository.js";
import { asyncHandler } from "src/helpers/async-handler.js";

const userService = new UserService(new UserRepository());
const userController = new UserController(userService);

const userRoutes: Router = Router();

userRoutes.post("/", asyncHandler(userController.createUser));

export default userRoutes;

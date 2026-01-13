import { Router } from "express";
import { asyncHandler } from "src/helpers/async-handler.js";
import UserRepository from "src/modules/user/user.repository.js";
import AuthController from "./auth.controller.js";
import AuthService from "./auth.service.js";

const authService = new AuthService(new UserRepository());
const authController = new AuthController(authService);

const authRoutes: Router = Router();

authRoutes.post("/login", asyncHandler(authController.login));

export default authRoutes;

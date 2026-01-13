import type { Request, Response } from "express";
import { z } from "zod";
import AuthService from "./auth.service.js";
import { loginSchema } from "./schemas/login.schema.js";
import { InvalidCredentialsError } from "src/shared/errors/auth.errors.js";

class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
    this.login = this.login.bind(this);
  }

  async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { accessToken, user } = await this.authService.login(validatedData);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      });

      res.status(200).json({
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullname: user.fullname,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Validation error",
          errors: error.issues.map((issue) => issue.message),
        });
      } else if (error instanceof InvalidCredentialsError) {
        res.status(401).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
}

export default AuthController;

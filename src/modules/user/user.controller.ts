import type UserService from "./user.service.js";
import type { Request, Response } from "express";
import { createUserSchema } from "./schemas/create-user.schema.js";
import { z } from "zod";
import { EmailAlreadyExistsError } from "src/shared/errors/user.errors.js";
import type { AuthenticatedRequest } from "src/middlewares/auth.middleware.js";

class UserController {
  private readonly userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
    this.createUser = this.createUser.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }
  async createUser(req: Request, res: Response) {
    try {
      const validatedData = createUserSchema.parse(req.body);
      const user = await this.userService.createUser(validatedData);
      res.status(201).json({
        message: "User created successfully",
        data: {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Validation error",
          errors: error.issues.map((issue) => issue.message),
        });
      } else if (error instanceof EmailAlreadyExistsError) {
        res.status(400).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await this.userService.getUserById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "User profile fetched successfully",
        data: {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
export default UserController;

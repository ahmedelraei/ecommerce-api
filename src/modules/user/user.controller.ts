import type UserService from "./user.service.js";
import type { Request, Response } from "express";
import { createUserSchema } from "./schemas/create-user.schema.js";
import { z } from "zod";
import { EmailAlreadyExistsError } from "src/shared/errors/user.errors.js";

class UserController {
  private readonly userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
    this.createUser = this.createUser.bind(this);
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
}
export default UserController;

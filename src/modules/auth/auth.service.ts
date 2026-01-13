import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "src/config/env.js";
import UserRepository from "src/modules/user/user.repository.js";
import type { LoginDto } from "./schemas/login.schema.js";
import { InvalidCredentialsError } from "src/shared/errors/auth.errors.js";

class AuthService {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async login(credentials: LoginDto) {
    const user = await this.userRepository.findUserByEmail(credentials.email);
    const isPasswordValid = user
      ? await bcrypt.compare(credentials.password, user.password)
      : false;

    if (!user || !isPasswordValid || !user.isActive) {
      throw new InvalidCredentialsError("Invalid email or password");
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      env.jwt.secret,
      {
        expiresIn: env.jwt.expiresIn as NonNullable<SignOptions["expiresIn"]>,
      }
    );

    return {
      accessToken,
      user,
    };
  }
}

export default AuthService;

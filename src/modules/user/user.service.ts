import UserRepository from "./user.repository.js";
import type { CreateUserDto } from "./schemas/create-user.schema.js";
import bcrypt from "bcrypt";
import { UserRole } from "src/enums/user.enums.js";
import { EmailAlreadyExistsError } from "src/shared/errors/user.errors.js";

class UserService {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
  async createUser(user: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findUserByEmail(
        user.email
      );
      if (existingUser)
        throw new EmailAlreadyExistsError("User already exists");

      const hashedPassword = await bcrypt.hash(user.password, 10);

      const newUser = this.userRepository.createUser({
        email: user.email,
        fullname: user.fullname,
        password: hashedPassword,
        role: UserRole.USER,
      });

      return newUser;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;

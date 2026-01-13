import { Repository } from "typeorm";
import { AppDataSource } from "src/data-source.js";
import type { CreateUserDto } from "./schemas/create-user.schema.js";
import { User } from "./entities/user.entity.js";
import type { IUser } from "./types/user.interface.js";

class UserRepository {
  private readonly userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async createUser(user: IUser): Promise<User> {
    return this.userRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}

export default UserRepository;

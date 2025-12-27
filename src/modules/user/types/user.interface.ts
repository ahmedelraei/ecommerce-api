import { UserRole } from "src/enums/user.enums.js";

export interface IUser {
  readonly id?: number;
  email: string;
  fullname: string;
  password: string;
  role: UserRole;
  isActive?: boolean;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

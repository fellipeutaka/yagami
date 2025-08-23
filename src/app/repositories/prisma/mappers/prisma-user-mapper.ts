import type { User as RawUser } from "@prisma/client";
import { User } from "~/app/entities/user";

export class PrismaUserMapper {
  static toPrisma(user: User): RawUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.password,
      createdAt: user.createdAt,
    };
  }

  static toDomain(raw: RawUser): User {
    return new User(
      {
        name: raw.name,
        email: raw.email,
        password: raw.passwordHash,
        createdAt: raw.createdAt,
      },
      raw.id
    );
  }
}

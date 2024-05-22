import type { User } from "~/app/entities/user";
import { prisma } from "~/http/lib/prisma";
import type { UsersRepository } from "../users-repository";
import { PrismaUserMapper } from "./mappers/prisma-user-mapper";

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async create(data: User) {
    const rawUser = await prisma.user.create({
      data: PrismaUserMapper.toPrisma(data),
    });

    return PrismaUserMapper.toDomain(rawUser);
  }
}

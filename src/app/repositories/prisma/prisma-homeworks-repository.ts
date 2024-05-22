import type { Homework } from "~/app/entities/homework";
import { prisma } from "~/http/lib/prisma";
import type { HomeworksRepository } from "../homeworks-repository";
import { PrismaHomeworkMapper } from "./mappers/prisma-homework-mapper";

export class PrismaHomeworksRepository implements HomeworksRepository {
  async findById(id: string) {
    const homework = await prisma.homework.findUnique({
      where: {
        id,
      },
    });

    if (!homework) {
      return null;
    }

    return PrismaHomeworkMapper.toDomain(homework);
  }

  async findMany() {
    const homeworks = await prisma.homework.findMany();

    return homeworks.map(PrismaHomeworkMapper.toDomain);
  }

  async create(data: Homework) {
    await prisma.homework.create({
      data: PrismaHomeworkMapper.toPrisma(data),
    });
  }

  async update(homework: Homework) {
    await prisma.homework.update({
      where: {
        id: homework.id,
      },
      data: PrismaHomeworkMapper.toPrisma(homework),
    });
  }

  async delete(id: string) {
    await prisma.homework.delete({
      where: {
        id,
      },
    });
  }
}

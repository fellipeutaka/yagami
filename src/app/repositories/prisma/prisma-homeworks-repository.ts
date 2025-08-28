import type { Homework } from "~/app/entities/homework";
import { prisma } from "~/lib/prisma";
import type { Prisma } from "~/prisma/generated/client/client";
import type {
  HomeworkPaginateProps,
  HomeworksRepository,
} from "../homeworks-repository";
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

  async paginate(props: HomeworkPaginateProps): Promise<{
    data: Homework[];
    meta: { lastCursor: string | null; hasNextPage: boolean };
  }> {
    const { lastCursor, perPage, userId } = props;

    const select = {
      id: true,
      title: true,
      description: true,
      dueDate: true,
      subject: true,
      completedAt: true,
      createdAt: true,
    } satisfies Prisma.HomeworkSelect;

    const data = await prisma.homework.findMany({
      where: {
        userId,
      },
      select,
      take: perPage,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
      orderBy: {
        createdAt: "asc",
      },
    });

    const cursor = data.at(-1)?.id;

    if (!cursor) {
      return {
        data: [],
        meta: {
          lastCursor: null,
          hasNextPage: false,
        },
      };
    }

    const nextPage = await prisma.homework.findMany({
      where: {
        userId,
      },
      select,
      take: 1,
      skip: 1,
      cursor: {
        id: cursor,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return {
      data: data.map((homework) =>
        PrismaHomeworkMapper.toDomain({ ...homework, userId })
      ),
      meta: {
        lastCursor: cursor,
        hasNextPage: nextPage.length > 0,
      },
    };
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

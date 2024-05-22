import type { Homework as RawHomework } from "@prisma/client";
import { Homework } from "~/app/entities/homework";

export class PrismaHomeworkMapper {
  static toPrisma(homework: Homework): RawHomework {
    return {
      id: homework.id,
      title: homework.title,
      description: homework.description,
      dueDate: homework.dueDate,
      subject: homework.subject,
      completedAt: homework.completedAt,
      createdAt: homework.createdAt,
      userId: homework.userId,
    };
  }

  static toDomain(raw: RawHomework): Homework {
    return new Homework(
      {
        title: raw.title,
        description: raw.description,
        dueDate: raw.dueDate,
        completedAt: raw.completedAt,
        createdAt: raw.createdAt,
        subject: raw.subject,
        userId: raw.userId,
      },
      raw.id,
    );
  }
}

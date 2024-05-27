import { PrismaHomeworksRepository } from "~/app/repositories/prisma/prisma-homeworks-repository";
import { DeleteHomeworkUseCase } from "../delete-homework";

export function makeDeleteHomeworkUseCase() {
  const homeworksRepository = new PrismaHomeworksRepository();
  const deleteHomeworkUseCase = new DeleteHomeworkUseCase(homeworksRepository);

  return deleteHomeworkUseCase;
}

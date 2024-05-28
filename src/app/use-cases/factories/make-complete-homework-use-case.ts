import { PrismaHomeworksRepository } from "~/app/repositories/prisma/prisma-homeworks-repository";
import { CompleteHomeworkUseCase } from "../complete-homework";

export function makeCompleteHomeworkUseCase() {
  const homeworksRepository = new PrismaHomeworksRepository();
  const completeHomeworkUseCase = new CompleteHomeworkUseCase(
    homeworksRepository,
  );

  return completeHomeworkUseCase;
}

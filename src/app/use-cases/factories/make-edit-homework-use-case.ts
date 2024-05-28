import { PrismaHomeworksRepository } from "~/app/repositories/prisma/prisma-homeworks-repository";
import { EditHomeworkUseCase } from "../edit-homework";

export function makeEditHomeworkUseCase() {
  const homeworksRepository = new PrismaHomeworksRepository();
  const editHomeworkUseCase = new EditHomeworkUseCase(homeworksRepository);

  return editHomeworkUseCase;
}

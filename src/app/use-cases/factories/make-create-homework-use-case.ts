import { PrismaHomeworksRepository } from "~/app/repositories/prisma/prisma-homeworks-repository";
import { CreateHomeworkUseCase } from "../create-homework";

export function makeCreateHomeworkUseCase() {
  const homeworksRepository = new PrismaHomeworksRepository();
  const createHomeworkUseCase = new CreateHomeworkUseCase(homeworksRepository);

  return createHomeworkUseCase;
}

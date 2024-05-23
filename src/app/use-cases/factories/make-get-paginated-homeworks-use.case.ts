import { PrismaHomeworksRepository } from "~/app/repositories/prisma/prisma-homeworks-repository";
import { GetPaginatedHomeworksUseCase } from "../get-paginated-homeworks";

export function makeGetPaginatedHomeworksUseCase() {
  const homeworksRepository = new PrismaHomeworksRepository();
  const useCase = new GetPaginatedHomeworksUseCase(homeworksRepository);

  return useCase;
}

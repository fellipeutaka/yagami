import type { HomeworksRepository } from "../repositories/homeworks-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { UnauthorizedError } from "./errors/unauthorized-error";

interface DeleteHomeworkUseCaseRequest {
  id: string;
  userId: string;
}

export class DeleteHomeworkUseCase {
  constructor(private homeworksRepository: HomeworksRepository) {}

  async execute({ id, userId }: DeleteHomeworkUseCaseRequest) {
    const homework = await this.homeworksRepository.findById(id);

    if (!homework) {
      throw new ResourceNotFoundError();
    }

    if (homework.userId !== userId) {
      throw new UnauthorizedError();
    }

    await this.homeworksRepository.delete(id);
  }
}

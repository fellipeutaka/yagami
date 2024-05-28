import type { HomeworksRepository } from "../repositories/homeworks-repository";
import { HomeworkAlreadyCompletedError } from "./errors/homework-already-completed";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { UnauthorizedError } from "./errors/unauthorized-error";

interface CompleteHomeworkUseCaseRequest {
  id: string;
  userId: string;
}

export class CompleteHomeworkUseCase {
  constructor(private homeworksRepository: HomeworksRepository) {}

  async execute({ id, userId }: CompleteHomeworkUseCaseRequest) {
    const homework = await this.homeworksRepository.findById(id);

    if (!homework) {
      throw new ResourceNotFoundError();
    }

    if (homework.userId !== userId) {
      throw new UnauthorizedError();
    }

    if (homework.completedAt) {
      throw new HomeworkAlreadyCompletedError();
    }

    homework.complete();
    await this.homeworksRepository.update(homework);
  }
}

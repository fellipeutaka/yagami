import { Homework } from "../entities/homework";
import type { HomeworksRepository } from "../repositories/homeworks-repository";
import type { CreateHomeworkUseCaseRequest } from "./create-homework";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { UnauthorizedError } from "./errors/unauthorized-error";

interface EditHomeworkUseCaseRequest
  extends Partial<CreateHomeworkUseCaseRequest> {
  id: string;
  userId: string;
}

export class EditHomeworkUseCase {
  constructor(private homeworksRepository: HomeworksRepository) {}

  async execute({
    id,
    userId,
    title,
    description,
    dueDate,
    subject,
  }: EditHomeworkUseCaseRequest) {
    const homework = await this.homeworksRepository.findById(id);

    if (!homework) {
      throw new ResourceNotFoundError();
    }

    if (homework.userId !== userId) {
      throw new UnauthorizedError();
    }

    await this.homeworksRepository.update(
      new Homework(
        {
          title: title ?? homework.title,
          description: description ?? homework.description,
          dueDate: dueDate ?? homework.dueDate,
          subject: subject ?? homework.subject,
          completedAt: homework.completedAt,
          createdAt: homework.createdAt,
          userId: homework.userId,
        },
        homework.id,
      ),
    );
  }
}

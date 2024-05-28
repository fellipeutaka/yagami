import type { Subject } from "../../constants/subjects";
import { Homework } from "../entities/homework";
import type { HomeworksRepository } from "../repositories/homeworks-repository";

export interface CreateHomeworkUseCaseRequest {
  title: string;
  description: string;
  dueDate: Date;
  subject: Subject;
  userId: string;
}

export class CreateHomeworkUseCase {
  constructor(private homeworksRepository: HomeworksRepository) {}

  async execute({
    title,
    description,
    dueDate,
    subject,
    userId,
  }: CreateHomeworkUseCaseRequest) {
    await this.homeworksRepository.create(
      new Homework({
        title,
        description,
        dueDate,
        subject,
        completedAt: null,
        createdAt: new Date(),
        userId,
      }),
    );
  }
}

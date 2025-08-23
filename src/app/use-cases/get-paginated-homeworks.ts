import type { HomeworksRepository } from "../repositories/homeworks-repository";

interface GetPaginatedHomeworksUseCaseRequest {
  lastCursor?: string | null;
  perPage: number;
  userId: string;
}

export class GetPaginatedHomeworksUseCase {
  constructor(private readonly homeworksRepository: HomeworksRepository) {}

  async execute({
    lastCursor,
    perPage,
    userId,
  }: GetPaginatedHomeworksUseCaseRequest) {
    return await this.homeworksRepository.paginate({
      lastCursor,
      perPage,
      userId,
    });
  }
}

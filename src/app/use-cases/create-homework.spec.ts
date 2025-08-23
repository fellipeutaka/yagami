import { beforeEach, describe, expect, it } from "vitest";
import { Homework } from "../entities/homework";
import { InMemoryHomeworksRepository } from "../repositories/in-memory/in-memory-homeworks-repository";
import { CreateHomeworkUseCase } from "./create-homework";

let homeworksRepository: InMemoryHomeworksRepository;
let sut: CreateHomeworkUseCase;

describe("Create Homework Use Case", () => {
  beforeEach(() => {
    homeworksRepository = new InMemoryHomeworksRepository();
    sut = new CreateHomeworkUseCase(homeworksRepository);
  });

  it("should be able to create a new homework", async () => {
    const userId = crypto.randomUUID();
    const dueDate = new Date();

    await expect(
      sut.execute({
        title: "Homework",
        description: "Description",
        dueDate,
        subject: "MATH",
        userId,
      })
    ).resolves.not.toThrow();

    const { data, meta } = await homeworksRepository.paginate({
      perPage: 10,
      userId,
    });

    expect(data).toHaveLength(1);
    expect(data.at(0)).toEqual(
      new Homework(
        {
          title: "Homework",
          description: "Description",
          dueDate,
          subject: "MATH",
          userId,
          completedAt: null,
          createdAt: data.at(0)?.createdAt ?? new Date(),
        },
        data.at(0)?.id
      )
    );

    expect(meta).toEqual({
      lastCursor: data.at(0)?.id,
      hasNextPage: false,
    });
  });
});

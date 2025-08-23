import { beforeEach, describe, expect, it } from "vitest";
import { Homework } from "../entities/homework";
import { User } from "../entities/user";
import { InMemoryHomeworksRepository } from "../repositories/in-memory/in-memory-homeworks-repository";
import { GetPaginatedHomeworksUseCase } from "./get-paginated-homeworks";

let homeworksRepository: InMemoryHomeworksRepository;
let sut: GetPaginatedHomeworksUseCase;

describe("Get Paginated Homeworks Use Case", () => {
  beforeEach(() => {
    homeworksRepository = new InMemoryHomeworksRepository();
    sut = new GetPaginatedHomeworksUseCase(homeworksRepository);
  });

  it("should be able to get paginated homeworks", async () => {
    const user = new User({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password",
      createdAt: new Date(),
    });

    await Promise.all([
      homeworksRepository.create(
        new Homework({
          title: "Homework 1",
          description: "Description 1",
          userId: user.id,
          createdAt: new Date(),
          completedAt: null,
          dueDate: new Date(),
          subject: "MATH",
        })
      ),
      homeworksRepository.create(
        new Homework({
          title: "Homework 2",
          description: "Description 2",
          userId: user.id,
          createdAt: new Date(),
          completedAt: null,
          dueDate: new Date(),
          subject: "CHEMISTRY",
        })
      ),
      homeworksRepository.create(
        new Homework({
          title: "Homework 3",
          description: "Description 3",
          userId: user.id,
          createdAt: new Date(),
          completedAt: null,
          dueDate: new Date(),
          subject: "GEOGRAPHY",
        })
      ),
    ]);

    const { data, meta } = await sut.execute({
      perPage: 2,
      userId: user.id,
    });

    expect(data).toHaveLength(2);
    expect(data.every((homework) => homework instanceof Homework)).toBe(true);
    expect(data[0]?.title).toBe("Homework 1");

    expect(meta).toEqual({
      lastCursor: data.at(-1)?.id,
      hasNextPage: true,
    });
  });

  it("should be able to get paginated homeworks with cursor", async () => {
    const user = new User({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password",
      createdAt: new Date(),
    });

    await Promise.all([
      homeworksRepository.create(
        new Homework({
          title: "Homework 1",
          description: "Description 1",
          userId: user.id,
          createdAt: new Date(),
          completedAt: null,
          dueDate: new Date(),
          subject: "MATH",
        })
      ),
      homeworksRepository.create(
        new Homework({
          title: "Homework 2",
          description: "Description 2",
          userId: user.id,
          createdAt: new Date(),
          completedAt: null,
          dueDate: new Date(),
          subject: "CHEMISTRY",
        })
      ),
      homeworksRepository.create(
        new Homework({
          title: "Homework 3",
          description: "Description 3",
          userId: user.id,
          createdAt: new Date(),
          completedAt: null,
          dueDate: new Date(),
          subject: "GEOGRAPHY",
        })
      ),
    ]);

    const paginatedHomeworks = await sut.execute({
      perPage: 2,
      userId: user.id,
    });

    const { data, meta } = await sut.execute({
      lastCursor: paginatedHomeworks.meta.lastCursor,
      perPage: 2,
      userId: user.id,
    });

    expect(data).toHaveLength(1);
    expect(data[0]).toBeInstanceOf(Homework);
    expect(data[0]?.title).toBe("Homework 3");

    expect(meta).toEqual({
      lastCursor: data.at(-1)?.id,
      hasNextPage: false,
    });
  });
});

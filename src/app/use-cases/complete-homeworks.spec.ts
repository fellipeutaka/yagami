import { ulid } from "ulidx";
import { beforeEach, describe, expect, it } from "vitest";
import { Homework } from "../entities/homework";
import { User } from "../entities/user";
import { InMemoryHomeworksRepository } from "../repositories/in-memory/in-memory-homeworks-repository";
import { CompleteHomeworkUseCase } from "./complete-homework";
import { HomeworkAlreadyCompletedError } from "./errors/homework-already-completed";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { UnauthorizedError } from "./errors/unauthorized-error";

let homeworksRepository: InMemoryHomeworksRepository;
let sut: CompleteHomeworkUseCase;

describe("Complete Homework Use Case", () => {
  beforeEach(() => {
    homeworksRepository = new InMemoryHomeworksRepository();
    sut = new CompleteHomeworkUseCase(homeworksRepository);
  });

  it("should be able to complete a homework", async () => {
    const user = new User({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password",
      createdAt: new Date(),
    });

    const homeworkId = ulid();
    const now = new Date();

    await homeworksRepository.create(
      new Homework(
        {
          title: "Homework",
          description: "Description",
          userId: user.id,
          createdAt: now,
          completedAt: null,
          dueDate: now,
          subject: "MATH",
        },
        homeworkId
      )
    );

    await expect(
      sut.execute({
        id: homeworkId,
        userId: user.id,
      })
    ).resolves.not.toThrow();

    const homework = await homeworksRepository.findById(homeworkId);

    expect(homework?.completedAt).not.toBeNull();
    expect(homework).toEqual(
      new Homework(
        {
          title: "Homework",
          description: "Description",
          userId: user.id,
          createdAt: now,
          completedAt: expect.any(Date),
          dueDate: now,
          subject: "MATH",
        },
        homeworkId
      )
    );
  });

  it("should not be able to edit a homework that does not exist", async () => {
    const user = new User({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password",
      createdAt: new Date(),
    });

    await expect(
      sut.execute({
        id: ulid(),
        userId: user.id,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to edit a homework that belongs to another user", async () => {
    const user1 = new User({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password",
      createdAt: new Date(),
    });

    const user2 = new User({
      name: "Fellipe Utaka",
      email: "fellipeutaka@gmail.com",
      password: "password",
      createdAt: new Date(),
    });

    const homeworkId = ulid();

    await homeworksRepository.create(
      new Homework(
        {
          title: "Homework",
          description: "Description",
          userId: user1.id,
          createdAt: new Date(),
          completedAt: null,
          dueDate: new Date(),
          subject: "MATH",
        },
        homeworkId
      )
    );

    await expect(
      sut.execute({
        id: homeworkId,
        userId: user2.id,
      })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("should not be able to complete a homework that is already completed", async () => {
    const user = new User({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password",
      createdAt: new Date(),
    });

    const homeworkId = ulid();
    const now = new Date();

    await homeworksRepository.create(
      new Homework(
        {
          title: "Homework",
          description: "Description",
          userId: user.id,
          createdAt: now,
          completedAt: new Date(),
          dueDate: now,
          subject: "MATH",
        },
        homeworkId
      )
    );

    await expect(
      sut.execute({
        id: homeworkId,
        userId: user.id,
      })
    ).rejects.toBeInstanceOf(HomeworkAlreadyCompletedError);
  });
});

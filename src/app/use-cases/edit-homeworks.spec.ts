import { beforeEach, describe, expect, it } from "vitest";
import { ulid } from "~/lib/ulid";
import { Homework } from "../entities/homework";
import { User } from "../entities/user";
import { InMemoryHomeworksRepository } from "../repositories/in-memory/in-memory-homeworks-repository";
import { EditHomeworkUseCase } from "./edit-homework";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { UnauthorizedError } from "./errors/unauthorized-error";

let homeworksRepository: InMemoryHomeworksRepository;
let sut: EditHomeworkUseCase;

describe("Edit Homework Use Case", () => {
  beforeEach(() => {
    homeworksRepository = new InMemoryHomeworksRepository();
    sut = new EditHomeworkUseCase(homeworksRepository);
  });

  it("should be able to edit a homework", async () => {
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
        homeworkId,
      ),
    );

    await expect(
      sut.execute({
        id: homeworkId,
        userId: user.id,
        title: "Math homework (EDITED)",
        description: "Do the exercises 1, 2, 3 and 4",
      }),
    ).resolves.not.toThrow();

    const homework = await homeworksRepository.findById(homeworkId);

    expect(homework).toEqual(
      new Homework(
        {
          title: "Math homework (EDITED)",
          description: "Do the exercises 1, 2, 3 and 4",
          userId: user.id,
          createdAt: now,
          completedAt: null,
          dueDate: now,
          subject: "MATH",
        },
        homeworkId,
      ),
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
      }),
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
        homeworkId,
      ),
    );

    await expect(
      sut.execute({
        id: homeworkId,
        userId: user2.id,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});

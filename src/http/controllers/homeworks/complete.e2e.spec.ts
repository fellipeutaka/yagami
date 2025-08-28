import { hash } from "argon2";
import { ulid } from "ulidx";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "~/app";
import { prisma } from "~/lib/prisma";
import { createAndAuthenticateUser } from "~/utils/tests/create-and-authenticate-user";
import { getTomorrow } from "~/utils/tests/get-tomorrow";

describe("Complete homework (E2E)", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  const authenticatedUser = await createAndAuthenticateUser(app);

  it("should be able to complete a homework", async () => {
    const dueDate = getTomorrow().toISOString();
    const homeworkId = ulid();
    const createdAt = new Date();

    await prisma.homework.create({
      data: {
        id: homeworkId,
        title: "Math homework",
        description: "Do the exercises 1, 2 and 3",
        dueDate,
        subject: "MATH",
        userId: authenticatedUser.userId,
        createdAt,
      },
    });

    const { statusCode, body } = await app.inject({
      method: "PATCH",
      url: `/homeworks/${homeworkId}`,
      headers: {
        authorization: `Bearer ${authenticatedUser.accessToken}`,
      },
    });

    const editedHomework = await prisma.homework.findUnique({
      where: {
        id: homeworkId,
      },
    });

    expect(statusCode).toEqual(200);
    expect(body).toEqual("");
    expect(editedHomework?.completedAt).not.toBeNull();
    expect(editedHomework).toEqual({
      id: homeworkId,
      title: "Math homework",
      description: "Do the exercises 1, 2 and 3",
      dueDate: new Date(dueDate),
      subject: "MATH",
      userId: authenticatedUser.userId,
      createdAt,
      completedAt: expect.any(Date),
    });
  });

  it("should not be able to complete a homework that does not exist", async () => {
    const { statusCode, body } = await app.inject({
      method: "PATCH",
      url: `/homeworks/${ulid()}`,
      headers: {
        authorization: `Bearer ${authenticatedUser.accessToken}`,
      },
    });

    expect(statusCode).toEqual(404);
    expect(JSON.parse(body)).toEqual({
      message: "Resource not found",
    });
  });

  it("should not be able to complete a homework that belongs to another user", async () => {
    const homeworkId = ulid();

    const userId = crypto.randomUUID();

    await prisma.user.create({
      data: {
        id: userId,
        name: "Fellipe Utaka",
        email: "fellipeutaka@gmail.com",
        passwordHash: await hash("123456"),
      },
    });

    await prisma.homework.create({
      data: {
        id: homeworkId,
        title: "Math homework",
        description: "Do the exercises 1, 2 and 3",
        dueDate: getTomorrow(),
        subject: "MATH",
        userId,
      },
    });

    const { statusCode, body } = await app.inject({
      method: "PATCH",
      url: `/homeworks/${homeworkId}`,
      headers: {
        authorization: `Bearer ${authenticatedUser.accessToken}`,
      },
    });

    expect(statusCode).toEqual(401);
    expect(JSON.parse(body)).toEqual({
      message: "Unauthorized",
    });
  });

  it("should not be able to complete a homework that is already completed", async () => {
    const dueDate = getTomorrow().toISOString();
    const homeworkId = ulid();
    const createdAt = new Date();

    await prisma.homework.create({
      data: {
        id: homeworkId,
        title: "Math homework",
        description: "Do the exercises 1, 2 and 3",
        dueDate,
        subject: "MATH",
        userId: authenticatedUser.userId,
        createdAt,
        completedAt: new Date(),
      },
    });

    const { statusCode, body } = await app.inject({
      method: "PATCH",
      url: `/homeworks/${homeworkId}`,
      headers: {
        authorization: `Bearer ${authenticatedUser.accessToken}`,
      },
    });

    expect(statusCode).toEqual(400);
    expect(JSON.parse(body)).toEqual({
      message: "Homework already completed",
    });
  });
});

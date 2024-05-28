import { hash } from "argon2";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "~/app";
import { prisma } from "~/lib/prisma";
import { ulid } from "~/lib/ulid";
import { createAndAuthenticateUser } from "~/utils/tests/create-and-authenticate-user";
import { getTomorrow } from "~/utils/tests/get-tomorrow";

describe("Edit homework (E2E)", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  const { accessToken, userId } = await createAndAuthenticateUser(app);

  it("should be able to edit a homework", async () => {
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
        userId,
        createdAt,
      },
    });

    const { statusCode, body } = await app.inject({
      method: "PUT",
      url: `/homeworks/${homeworkId}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: {
        title: "Math homework (EDITED)",
        description: "Do the exercises 1, 2, 3 and 4",
        dueDate,
        subject: "MATH",
      },
    });

    const editedHomework = await prisma.homework.findUnique({
      where: {
        id: homeworkId,
      },
    });

    expect(statusCode).toEqual(200);
    expect(body).toEqual("");
    expect(editedHomework).toEqual({
      id: homeworkId,
      title: "Math homework (EDITED)",
      description: "Do the exercises 1, 2, 3 and 4",
      dueDate: new Date(dueDate),
      subject: "MATH",
      userId,
      createdAt,
      completedAt: null,
    });
  });

  it("should not be able to edit a homework that does not exist", async () => {
    const { statusCode, body } = await app.inject({
      method: "PUT",
      url: `/homeworks/${ulid()}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: {
        title: "Math homework (EDITED)",
        description: "Do the exercises 1, 2, 3 and 4",
        dueDate: getTomorrow(),
        subject: "MATH",
      },
    });

    expect(statusCode).toEqual(404);
    expect(JSON.parse(body)).toEqual({
      message: "Resource not found",
    });
  });

  it("should not be able to edit a homework that belongs to another user", async () => {
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
      method: "PUT",
      url: `/homeworks/${homeworkId}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: {
        title: "Math homework (EDITED)",
        description: "Do the exercises 1, 2, 3 and 4",
        dueDate: getTomorrow(),
        subject: "MATH",
      },
    });

    expect(statusCode).toEqual(401);
    expect(JSON.parse(body)).toEqual({
      message: "Unauthorized",
    });
  });
});

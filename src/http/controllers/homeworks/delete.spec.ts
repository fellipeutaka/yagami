import { hash } from "argon2";
import { ulid } from "ulidx";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "~/app";
import { prisma } from "~/lib/prisma";
import { createAndAuthenticateUser } from "~/utils/tests/create-and-authenticate-user";
import { getTomorrow } from "~/utils/tests/get-tomorrow";

describe("Delete homework (E2E)", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  const authenticatedUser = await createAndAuthenticateUser(app);

  it("should be able to delete a homework", async () => {
    const dueDate = getTomorrow().toISOString();

    const homeworkId = ulid();

    await prisma.homework.create({
      data: {
        id: homeworkId,
        title: "Math homework",
        description: "Do the exercises 1, 2 and 3",
        dueDate,
        subject: "MATH",
        userId: authenticatedUser.userId,
      },
    });

    const { statusCode, body } = await app.inject({
      method: "DELETE",
      url: `/homeworks/${homeworkId}`,
      headers: {
        authorization: `Bearer ${authenticatedUser.accessToken}`,
      },
    });

    expect(statusCode).toEqual(200);
    expect(body).toEqual("");
  });

  it("should not be able to delete a homework that does not exist", async () => {
    const { statusCode, body } = await app.inject({
      method: "DELETE",
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

  it("should not be able to delete a homework that belongs to another user", async () => {
    const dueDate = getTomorrow().toISOString();

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
        dueDate,
        subject: "MATH",
        userId,
      },
    });

    const { statusCode, body } = await app.inject({
      method: "DELETE",
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
});

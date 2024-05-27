import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "~/app";
import { prisma } from "~/lib/prisma";
import { ulid } from "~/lib/ulid";
import { createAndAuthenticateUser } from "~/utils/tests/create-and-authenticate-user";
import { successSchema } from "./list";

describe("List homeworks (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get paginated homeworks", async () => {
    const { accessToken, userId } = await createAndAuthenticateUser(app);

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);
    for (let i = 0; i < 20; i++) {
      await prisma.homework.create({
        data: {
          id: ulid(),
          title: `Math homework ${i + 1}`,
          description: "Do the exercises 1, 2 and 3",
          dueDate: dueDate.toISOString(),
          subject: "MATH",
          userId,
        },
      });
    }

    const { body } = await app.inject({
      method: "GET",
      url: "/homeworks",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const { data, meta } = successSchema.parse(JSON.parse(body));

    expect(data).toHaveLength(10);
    expect(data[0]?.title).toBe("Math homework 1");

    expect(meta).toEqual({
      lastCursor: data.at(-1)?.id,
      hasNextPage: true,
    });
  });

  it("should not be able to get paginated homeworks without being logged in", async () => {
    const { body, statusCode } = await app.inject({
      method: "GET",
      url: "/homeworks",
    });

    expect(JSON.parse(body)).toMatchObject({
      message: "Unauthorized",
    });

    expect(statusCode).toEqual(401);
  });
});

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "~/app";
import { createAndAuthenticateUser } from "~/utils/tests/create-and-authenticate-user";

describe("Create homework (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get paginated homeworks", async () => {
    const { accessToken } = await createAndAuthenticateUser(app);

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);

    const { statusCode } = await app.inject({
      method: "POST",
      url: "/homeworks",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: {
        title: "Math homework",
        description: "Do the exercises 1, 2 and 3",
        dueDate: dueDate.toISOString(),
        subject: "MATH",
      },
    });

    expect(statusCode).toEqual(201);
  });
});

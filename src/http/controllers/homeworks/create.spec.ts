import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "~/app";
import { createAndAuthenticateUser } from "~/utils/tests/create-and-authenticate-user";
import { getTomorrow } from "~/utils/tests/get-tomorrow";

describe("Create homework (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a new homework", async () => {
    const { accessToken } = await createAndAuthenticateUser(app);

    const dueDate = getTomorrow().toISOString();

    const { statusCode } = await app.inject({
      method: "POST",
      url: "/homeworks",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: {
        title: "Math homework",
        description: "Do the exercises 1, 2 and 3",
        dueDate,
        subject: "MATH",
      },
    });

    expect(statusCode).toEqual(201);
  });
});

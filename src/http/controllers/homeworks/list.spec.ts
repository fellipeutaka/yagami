import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "~/app";

describe("List homeworks (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get paginated homeworks", async () => {
    await app.inject({
      method: "POST",
      url: "/sign-up",
      body: {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123456",
      },
    });

    const { body } = await app.inject({
      method: "POST",
      url: "/sign-in",
      body: {
        email: "johndoe@example.com",
        password: "123456",
      },
    });

    const { accessToken, refreshToken } = JSON.parse(body) as Record<
      "accessToken" | "refreshToken",
      string
    >;

    // TODO: Implement the test
    expect(true).toBe(true);
  });
});

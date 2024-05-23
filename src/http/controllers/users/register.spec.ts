import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "~/app";

describe("Register (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to register", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/sign-up",
      body: {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123456",
      },
    });

    expect(response.statusCode).toEqual(201);
  });
});

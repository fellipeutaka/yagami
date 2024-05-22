import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "~/app";
import { REGEXP_JWT } from "~/constants/regex";

describe("Authenticate (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to authenticate", async () => {
    await app.inject({
      method: "POST",
      url: "/sign-up",
      body: {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123456",
      },
    });

    const response = await app.inject({
      method: "POST",
      url: "/sign-in",
      body: {
        email: "johndoe@example.com",
        password: "123456",
      },
    });

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual({
      accessToken: expect.stringMatching(REGEXP_JWT),
      refreshToken: expect.stringMatching(REGEXP_JWT),
    });
  });
});

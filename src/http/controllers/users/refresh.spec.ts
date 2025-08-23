import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "~/app";
import { REGEXP_JWT } from "~/constants/regex";
import { createAndAuthenticateUser } from "~/utils/tests/create-and-authenticate-user";

describe("Refresh Token (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to refresh a token", async () => {
    const { refreshToken } = await createAndAuthenticateUser(app);

    const response = await app.inject({
      method: "PATCH",
      url: "/token/refresh",
      headers: {
        authorization: `Bearer ${refreshToken}`,
      },
    });

    expect(response.statusCode).toEqual(201);
    expect(JSON.parse(response.body)).toEqual({
      accessToken: expect.stringMatching(REGEXP_JWT),
      refreshToken: expect.stringMatching(REGEXP_JWT),
    });
  });
});

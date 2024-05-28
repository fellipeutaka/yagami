import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "~/app";
import { createAndAuthenticateUser } from "~/utils/tests/create-and-authenticate-user";
import { successSchema } from "./profile";

describe("Profile (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get user profile", async () => {
    const { accessToken } = await createAndAuthenticateUser(app);

    const profileResponse = await app.inject({
      method: "GET",
      url: "/me",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const { user } = successSchema.parse(JSON.parse(profileResponse.body));

    expect(profileResponse.statusCode).toEqual(200);
    expect(user).toEqual(
      expect.objectContaining({
        email: "johndoe@example.com",
      }),
    );
  });
});

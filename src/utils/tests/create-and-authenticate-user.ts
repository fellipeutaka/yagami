import { hash } from "argon2";
import type { FastifyInstance } from "fastify";
import { successSchema } from "~/http/controllers/users/authenticate";
import { prisma } from "~/lib/prisma";

export async function createAndAuthenticateUser(app: FastifyInstance) {
  const userId = crypto.randomUUID();

  await prisma.user.create({
    data: {
      id: userId,
      name: "John Doe",
      email: "johndoe@example.com",
      passwordHash: await hash("123456"),
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

  const { accessToken, refreshToken } = successSchema.parse(JSON.parse(body));

  return { accessToken, refreshToken, userId };
}

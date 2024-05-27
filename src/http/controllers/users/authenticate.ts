import type { FastifyInstance } from "fastify";
import type { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { z } from "zod";
import { InvalidCredentialsError } from "~/app/use-cases/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "~/app/use-cases/factories/make-authenticate-use-case";

export const successSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export async function authenticate(app: FastifyInstance) {
  app.withTypeProvider<FastifyZodOpenApiTypeProvider>().post(
    "/sign-in",
    {
      schema: {
        description: "Authenticate a user",
        tags: ["User"],
        body: z.object({
          email: z.string().email().openapi({ example: "johndoe@example.com" }),
          password: z.string().min(6).openapi({ example: "123456" }),
        }),
        response: {
          201: successSchema,
          400: z
            .object({
              message: z
                .string()
                .openapi({ example: new InvalidCredentialsError().message }),
            })
            .openapi({
              description: "Bad Request",
            }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      try {
        const authenticateUseCase = makeAuthenticateUseCase();

        const { user } = await authenticateUseCase.execute({
          email,
          password,
        });

        const accessToken = await reply.jwtSign(
          {},
          {
            sign: {
              sub: user.id,
              expiresIn: "10m",
            },
          },
        );

        const refreshToken = await reply.jwtSign(
          {},
          {
            sign: {
              sub: user.id,
              expiresIn: "7d",
            },
          },
        );

        return reply.status(200).send({
          accessToken,
          refreshToken,
        });
      } catch (err) {
        if (err instanceof InvalidCredentialsError) {
          return reply.status(400).send({ message: err.message });
        }

        throw err;
      }
    },
  );
}

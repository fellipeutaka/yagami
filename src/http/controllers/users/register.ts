import type { FastifyInstance } from "fastify";
import type { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { z } from "zod";
import { UserAlreadyExistsError } from "~/app/use-cases/errors/user-already-exists-error";
import { makeRegisterUseCase } from "~/app/use-cases/factories/make-register-use-case";

export async function register(app: FastifyInstance) {
  app.withTypeProvider<FastifyZodOpenApiTypeProvider>().post(
    "/sign-up",
    {
      schema: {
        description: "Register a new user",
        tags: ["User"],
        body: z.object({
          name: z.string().openapi({ example: "John Doe" }),
          email: z.string().email().openapi({ example: "johndoe@example.com" }),
          password: z.string().min(6).openapi({ example: "123456" }),
        }),
        response: {
          201: z.null(),
          409: z
            .object({
              message: z
                .string()
                .openapi({ example: "E-mail already exists." }),
            })
            .openapi({
              description: "Conflict",
            }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      try {
        const registerUseCase = makeRegisterUseCase();

        await registerUseCase.execute({
          name,
          email,
          password,
        });
      } catch (err) {
        if (err instanceof UserAlreadyExistsError) {
          return reply.status(409).send({ message: err.message });
        }
      }

      return reply.status(201).send();
    },
  );
}

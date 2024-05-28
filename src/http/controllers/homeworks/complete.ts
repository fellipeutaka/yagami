import type { FastifyInstance } from "fastify";
import type { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { z } from "zod";
import { HomeworkAlreadyCompletedError } from "~/app/use-cases/errors/homework-already-completed";
import { ResourceNotFoundError } from "~/app/use-cases/errors/resource-not-found-error";
import { UnauthorizedError } from "~/app/use-cases/errors/unauthorized-error";
import { makeCompleteHomeworkUseCase } from "~/app/use-cases/factories/make-complete-homework-use-case";
import {
  unauthorizedErrorSchema,
  verifyJwt,
} from "~/http/middlewares/verify-jwt";
import { securitySchemes } from "~/lib/swagger";

export async function complete(app: FastifyInstance) {
  app.withTypeProvider<FastifyZodOpenApiTypeProvider>().patch(
    "/homeworks/:id",
    {
      schema: {
        description: "Mark a homework as completed",
        tags: ["Homework"],
        security: [
          {
            [securitySchemes.Bearer.name]: [],
          },
        ],
        params: z.object({
          id: z.string().ulid().openapi({ description: "Homework ID" }),
        }),
        response: {
          ...unauthorizedErrorSchema,
          200: z.null(),
        },
      },
      onRequest: [(...params) => verifyJwt(...params)],
    },
    async (request, reply) => {
      const { id } = request.params;

      const completeHomeworkUseCase = makeCompleteHomeworkUseCase();

      try {
        await completeHomeworkUseCase.execute({
          id,
          userId: request.user.sub,
        });

        return reply.status(200).send();
      } catch (err) {
        if (err instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: err.message });
        }

        if (err instanceof UnauthorizedError) {
          return reply.status(401).send({ message: err.message });
        }

        if (err instanceof HomeworkAlreadyCompletedError) {
          return reply.status(400).send({ message: err.message });
        }

        throw err;
      }
    },
  );
}

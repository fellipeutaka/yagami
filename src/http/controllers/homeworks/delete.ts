import type { FastifyInstance } from "fastify";
import type { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { z } from "zod";
import { ResourceNotFoundError } from "~/app/use-cases/errors/resource-not-found-error";
import { UnauthorizedError } from "~/app/use-cases/errors/unauthorized-error";
import { makeDeleteHomeworkUseCase } from "~/app/use-cases/factories/make-delete-homework-use-case";
import {
  unauthorizedErrorSchema,
  verifyJwt,
} from "~/http/middlewares/verify-jwt";
import { securitySchemes } from "~/lib/swagger";

export async function deleteHomework(app: FastifyInstance) {
  app.withTypeProvider<FastifyZodOpenApiTypeProvider>().delete(
    "/homeworks/:id",
    {
      schema: {
        description: "Delete a homework",
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

      const deleteHomeworkUseCase = makeDeleteHomeworkUseCase();

      try {
        await deleteHomeworkUseCase.execute({
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

        throw err;
      }
    },
  );
}

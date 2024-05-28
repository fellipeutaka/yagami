import type { FastifyInstance } from "fastify";
import type { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { z } from "zod";
import { ResourceNotFoundError } from "~/app/use-cases/errors/resource-not-found-error";
import { UnauthorizedError } from "~/app/use-cases/errors/unauthorized-error";
import { makeEditHomeworkUseCase } from "~/app/use-cases/factories/make-edit-homework-use-case";
import {
  unauthorizedErrorSchema,
  verifyJwt,
} from "~/http/middlewares/verify-jwt";
import { securitySchemes } from "~/lib/swagger";
import { createHomeworkBodySchema } from "./create";

export async function edit(app: FastifyInstance) {
  app.withTypeProvider<FastifyZodOpenApiTypeProvider>().put(
    "/homeworks/:id",
    {
      schema: {
        description: "Edit a homework",
        tags: ["Homework"],
        security: [
          {
            [securitySchemes.Bearer.name]: [],
          },
        ],
        params: z.object({
          id: z.string().ulid().openapi({ description: "Homework ID" }),
        }),
        body: createHomeworkBodySchema.partial(),
        response: {
          ...unauthorizedErrorSchema,
          200: z.null(),
        },
      },
      onRequest: [(...params) => verifyJwt(...params)],
    },
    async (request, reply) => {
      const { id } = request.params;
      const { title, description, dueDate, subject } = request.body;

      const editHomeworkUseCase = makeEditHomeworkUseCase();

      try {
        await editHomeworkUseCase.execute({
          id,
          userId: request.user.sub,
          title,
          description,
          dueDate,
          subject,
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

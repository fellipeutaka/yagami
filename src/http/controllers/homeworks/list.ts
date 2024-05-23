import type { FastifyInstance } from "fastify";
import type { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { z } from "zod";
import { makeGetPaginatedHomeworksUseCase } from "~/app/use-cases/factories/make-get-paginated-homeworks-use.case";
import {
  unauthorizedErrorSchema,
  verifyJwt,
} from "~/http/middlewares/verify-jwt";
import { securitySchemes } from "~/lib/swagger";

export const successSchema = z.object({
  data: z
    .object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      dueDate: z.coerce.date(),
      subject: z.string(),
      completedAt: z.coerce.date().nullable(),
      createdAt: z.coerce.date(),
    })
    .array(),
  meta: z.object({
    lastCursor: z.string().nullable(),
    hasNextPage: z.boolean().openapi({
      example: false,
    }),
  }),
});

export async function list(app: FastifyInstance) {
  app.withTypeProvider<FastifyZodOpenApiTypeProvider>().get(
    "/homeworks",
    {
      schema: {
        description: "List homeworks",
        tags: ["Homework"],
        security: [
          {
            [securitySchemes.Bearer.name]: [],
          },
        ],
        querystring: z.object({
          lastCursor: z.string().optional().openapi({
            description: "The cursor to start fetching the next page",
          }),
          perPage: z.coerce
            .number()
            .int()
            .min(1)
            .max(50)
            .optional()
            .default(10)
            .openapi({
              example: 10,
              description: "The number of items per page",
            }),
        }),
        response: {
          ...unauthorizedErrorSchema,
          200: successSchema,
        },
      },
      onRequest: [(...params) => verifyJwt(...params)],
    },
    async (request, reply) => {
      const { lastCursor, perPage } = request.query;

      const getPaginatedHomeworksUseCase = makeGetPaginatedHomeworksUseCase();

      const { data, meta } = await getPaginatedHomeworksUseCase.execute({
        lastCursor,
        perPage,
        userId: request.user.sub,
      });

      return reply.status(200).send({
        data,
        meta,
      });
    },
  );
}

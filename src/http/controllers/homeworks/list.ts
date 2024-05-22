import type { FastifyInstance } from "fastify";
import type { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { z } from "zod";
import { securitySchemes } from "~/http/lib/swagger";
import {
  unauthorizedErrorSchema,
  verifyJwt,
} from "~/http/middlewares/verify-jwt";

export async function list(app: FastifyInstance) {
  app.withTypeProvider<FastifyZodOpenApiTypeProvider>().get(
    "/homeworks",
    {
      schema: {
        tags: ["Homework"],
        security: [
          {
            [securitySchemes.Bearer.name]: [],
          },
        ],
        response: {
          ...unauthorizedErrorSchema,
          200: z.object({
            data: z.object({}).array(),
            meta: z.object({
              total: z.number().openapi({ example: 23 }),
            }),
          }),
        },
      },
      onRequest: [(...params) => verifyJwt(...params)],
    },
    async (request, reply) => {
      return reply.status(200).send({
        data: [],
        meta: {
          total: 10,
        },
      });
    },
  );
}

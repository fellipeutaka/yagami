import type { FastifyInstance } from "fastify";
import type { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { z } from "zod";
import {
  unauthorizedErrorSchema,
  verifyJwt,
} from "~/http/middlewares/verify-jwt";
import { securitySchemes } from "~/lib/swagger";

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
          }),
        },
      },
      onRequest: [(request, reply) => verifyJwt(request, reply)],
    },
    async (request, reply) => {
      return reply.status(200).send({
        data: [],
      });
    },
  );
}

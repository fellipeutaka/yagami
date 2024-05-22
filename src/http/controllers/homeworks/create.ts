import { Subject } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import type { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { z } from "zod";
import {
  unauthorizedErrorSchema,
  verifyJwt,
} from "~/http/middlewares/verify-jwt";
import { securitySchemes } from "~/lib/swagger";

export async function create(app: FastifyInstance) {
  app.withTypeProvider<FastifyZodOpenApiTypeProvider>().post(
    "/homeworks",
    {
      schema: {
        tags: ["Homework"],
        security: [
          {
            [securitySchemes.Bearer.name]: [],
          },
        ],
        body: z.object({
          title: z
            .string()
            .min(3)
            .max(255)
            .openapi({ example: "Math homework" }),
          description: z
            .string()
            .min(3)
            .max(255)
            .openapi({ example: "Do the exercises 1, 2 and 3" }),
          // dueDate: z.date().min(new Date()).openapi({ example: new Date() }),
          subject: z.nativeEnum(Subject).openapi({ example: "MATH" }),
        }),
        response: {
          ...unauthorizedErrorSchema,
        },
      },
      onRequest: [(request, reply) => verifyJwt(request, reply)],
    },
    async (request, reply) => {
      return reply.status(201).send();
    },
  );
}

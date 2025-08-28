import type { FastifyInstance } from "fastify";
import type { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { z } from "zod";
import { makeCreateHomeworkUseCase } from "~/app/use-cases/factories/make-create-homework-use-case";
import { subjects } from "~/constants/subjects";
import {
  unauthorizedErrorSchema,
  verifyJwt,
} from "~/http/middlewares/verify-jwt";
import { securitySchemes } from "~/lib/swagger";

export const createHomeworkBodySchema = z.object({
  title: z.string().min(3).max(255).meta({ example: "Math homework" }),
  description: z
    .string()
    .min(3)
    .max(255)
    .meta({ example: "Do the exercises 1, 2 and 3" }),
  dueDate: z.coerce
    .date()
    .min(new Date(), "Due date must be in the future")
    .meta({ example: new Date() }),
  subject: z.nativeEnum(subjects).meta({ example: "MATH" }),
});

export async function create(app: FastifyInstance) {
  app.withTypeProvider<FastifyZodOpenApiTypeProvider>().post(
    "/homeworks",
    {
      schema: {
        description: "Create a new homework",
        tags: ["Homework"],
        security: [
          {
            [securitySchemes.Bearer.name]: [],
          },
        ],
        body: createHomeworkBodySchema,
        response: {
          ...unauthorizedErrorSchema,
          201: z.null(),
        },
      },
      onRequest: [(...params) => verifyJwt(...params)],
    },
    async (request, reply) => {
      const { title, description, dueDate, subject } = request.body;

      const createHomeworkUseCase = makeCreateHomeworkUseCase();

      await createHomeworkUseCase.execute({
        title,
        description,
        dueDate,
        subject,
        userId: request.user.sub,
      });

      return reply.status(201).send();
    }
  );
}

import type { FastifyInstance } from "fastify";
import type { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { z } from "zod";
import {
  unauthorizedErrorSchema,
  verifyJwt,
} from "~/http/middlewares/verify-jwt";
import { securitySchemes } from "~/lib/swagger";
import { makeGetUserProfileUseCase } from "~/use-cases/factories/make-get-user-profile-use.case";

export async function profile(app: FastifyInstance) {
  app.withTypeProvider<FastifyZodOpenApiTypeProvider>().get(
    "/me",
    {
      schema: {
        tags: ["User"],
        security: [
          {
            [securitySchemes.Bearer.name]: [],
          },
        ],
        response: {
          ...unauthorizedErrorSchema,
          200: z.object({
            user: z.object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
              createdAt: z.date(),
            }),
          }),
        },
      },
      onRequest: [(request, reply) => verifyJwt(request, reply)],
    },
    async (request, reply) => {
      const getUserProfile = makeGetUserProfileUseCase();

      const { user } = await getUserProfile.execute({
        userId: request.user.sub,
      });

      return reply.status(200).send({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    },
  );
}
import type { FastifyInstance } from "fastify";
import type { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { z } from "zod";
import { makeGetUserProfileUseCase } from "~/app/use-cases/factories/make-get-user-profile-use.case";
import { securitySchemes } from "~/http/lib/swagger";
import {
  unauthorizedErrorSchema,
  verifyJwt,
} from "~/http/middlewares/verify-jwt";

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
      onRequest: [(...params) => verifyJwt(...params)],
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

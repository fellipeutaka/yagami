import type { FastifyInstance } from "fastify";
import type { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { z } from "zod";
import { makeGetUserProfileUseCase } from "~/app/use-cases/factories/make-get-user-profile-use.case";
import {
  unauthorizedErrorSchema,
  verifyJwt,
} from "~/http/middlewares/verify-jwt";
import { securitySchemes } from "~/lib/swagger";

export const successSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    createdAt: z.coerce.date(),
  }),
});

export async function profile(app: FastifyInstance) {
  app.withTypeProvider<FastifyZodOpenApiTypeProvider>().get(
    "/me",
    {
      schema: {
        description: "Get user profile",
        tags: ["User"],
        security: [
          {
            [securitySchemes.Bearer.name]: [],
          },
        ],
        response: {
          ...unauthorizedErrorSchema,
          200: successSchema,
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

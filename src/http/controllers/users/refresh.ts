import type { FastifyInstance } from "fastify";
import type { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { z } from "zod";
import { securitySchemes } from "~/http/lib/swagger";
import {
  unauthorizedErrorSchema,
  verifyJwt,
} from "~/http/middlewares/verify-jwt";

export async function refresh(app: FastifyInstance) {
  app.withTypeProvider<FastifyZodOpenApiTypeProvider>().patch(
    "/token/refresh",
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
          201: z.object({
            accessToken: z.string(),
            refreshToken: z.string(),
          }),
        },
      },
      onRequest: [(...params) => verifyJwt(...params)],
    },
    async (request, reply) => {
      const accessToken = await reply.jwtSign(
        {},
        {
          sign: {
            sub: request.user.sub,
            expiresIn: "10m",
          },
        },
      );

      const refreshToken = await reply.jwtSign(
        {},
        {
          sign: {
            sub: request.user.sub,
            expiresIn: "7d",
          },
        },
      );

      return reply.status(201).send({
        accessToken,
        refreshToken,
      });
    },
  );
}

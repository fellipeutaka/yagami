import type { FastifyInstance } from "fastify";
import type { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { z } from "zod";
import {
  unauthorizedErrorSchema,
  verifyJwt,
} from "~/http/middlewares/verify-jwt";
import { securitySchemes } from "~/lib/swagger";

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
      onRequest: [(request, reply) => verifyJwt(request, reply)],
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

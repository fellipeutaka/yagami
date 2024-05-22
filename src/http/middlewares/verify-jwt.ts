import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
const message = "Unauthorized.";

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({ message });
  }
}

export const unauthorizedErrorSchema = {
  401: z
    .object({
      message: z.string().openapi({ example: message }),
    })
    .openapi({
      description: "Unauthorized",
    }),
} as const;

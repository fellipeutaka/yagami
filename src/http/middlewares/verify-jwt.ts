import type {
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from "fastify";
import { z } from "zod";
import { UnauthorizedError } from "~/app/use-cases/errors/unauthorized-error";

const { message } = new UnauthorizedError();

export async function verifyJwt(
  request: FastifyRequest,
  reply: FastifyReply,
  _done?: HookHandlerDoneFunction
) {
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({ message });
  }
}

export const unauthorizedErrorSchema = {
  401: z
    .object({
      message: z.string().meta({ example: message }),
    })
    .meta({
      description: message,
    }),
} as const;

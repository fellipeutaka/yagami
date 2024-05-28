import type { FastifyInstance } from "fastify";
import { complete } from "./complete";
import { create } from "./create";
import { deleteHomework } from "./delete";
import { edit } from "./edit";
import { list } from "./list";

export async function homeworksRoutes(app: FastifyInstance) {
  app.register(list);
  app.register(create);
  app.register(edit);
  app.register(deleteHomework);
  app.register(complete);
}

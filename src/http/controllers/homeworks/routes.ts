import type { FastifyInstance } from "fastify";
import { create } from "./create";
import { deleteHomework } from "./delete";
import { list } from "./list";

export async function homeworksRoutes(app: FastifyInstance) {
  app.register(list);
  app.register(create);
  app.register(deleteHomework);
  // app.put(
  //   "/homeworks/:id",
  //   {
  //     schema: {
  //       tags: ["Homework"],
  //     },
  //     onRequest: [(...params) => verifyJwt(...params)],
  //   },
  //   list,
  // );
  // app.patch(
  //   "/homeworks/:id",
  //   {
  //     schema: {
  //       tags: ["Homework"],
  //     },
  //     onRequest: [(...params) => verifyJwt(...params)],
  //   },
  //   list,
  // );
}

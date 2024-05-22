import type { FastifyInstance } from "fastify";
import { create } from "./create";
import { list } from "./list";

export async function homeworksRoutes(app: FastifyInstance) {
  app.register(list);
  app.register(create);
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
  // app.delete(
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

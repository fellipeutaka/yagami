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
  //     onRequest: [(request, reply) => verifyJwt(request, reply)],
  //   },
  //   list,
  // );
  // app.patch(
  //   "/homeworks/:id",
  //   {
  //     schema: {
  //       tags: ["Homework"],
  //     },
  //     onRequest: [(request, reply) => verifyJwt(request, reply)],
  //   },
  //   list,
  // );
  // app.delete(
  //   "/homeworks/:id",
  //   {
  //     schema: {
  //       tags: ["Homework"],
  //     },
  //     onRequest: [(request, reply) => verifyJwt(request, reply)],
  //   },
  //   list,
  // );
}
import { fastify } from "fastify";

import {
  fastifyZodOpenApiPlugin,
  fastifyZodOpenApiTransform,
  fastifyZodOpenApiTransformObject,
  RequestValidationError,
  serializerCompiler,
  validatorCompiler,
} from "fastify-zod-openapi";
import { ZodError } from "zod";
import { treeifyError } from "zod/mini";
import packageJson from "../package.json" with { type: "json" };
import { env } from "./env";
import { homeworksRoutes } from "./http/controllers/homeworks/routes";
import { usersRoutes } from "./http/controllers/users/routes";
import { securitySchemes } from "./lib/swagger";

export const app = fastify();

app.setErrorHandler((error, _req, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error",
      errors: treeifyError(error),
    });
  }

  if (error instanceof RequestValidationError) {
    return reply.status(400).send({
      message: "Validation error",
      errors: treeifyError(error.params.error),
    });
  }

  console.error(error);

  return reply.status(500).send({ message: "Internal server error" });
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(import("@fastify/jwt"), {
  secret: env.JWT_SECRET,
});

app.register(fastifyZodOpenApiPlugin);
app.register(import("@fastify/swagger"), {
  openapi: {
    info: {
      title: "Yagami",
      description: packageJson.description,
      version: packageJson.version,
      contact: {
        name: packageJson.author.name,
        email: packageJson.author.email,
        url: packageJson.author.url,
      },
    },
    components: {
      securitySchemes,
    },
  },
  transform: fastifyZodOpenApiTransform,
  transformObject: fastifyZodOpenApiTransformObject,
});
app.register(import("@scalar/fastify-api-reference"), {
  routePrefix: "/docs",
  configuration: {
    metaData: {
      title: "Yagami",
      description: packageJson.description,
      author: packageJson.author.name,
    },
  },
});

app.register(homeworksRoutes);
app.register(usersRoutes);

import type { ZodOpenApiComponentsObject } from "zod-openapi";

export const securitySchemes = {
  Bearer: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    name: "Bearer",
  },
} as const satisfies ZodOpenApiComponentsObject["securitySchemes"];

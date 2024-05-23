import type { ZodOpenApiComponentsObject } from "zod-openapi";

export const securitySchemes = {
  // biome-ignore lint/style/useNamingConvention: This is a constant from the OpenAPI spec
  Bearer: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    name: "Bearer",
  },
} as const satisfies ZodOpenApiComponentsObject["securitySchemes"];

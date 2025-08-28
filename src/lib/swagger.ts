import type { OpenAPIV3 } from "openapi-types";

export const securitySchemes = {
  Bearer: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    name: "Bearer",
  },
} as const satisfies Record<
  string,
  OpenAPIV3.SecuritySchemeObject & {
    name: string;
  }
>;

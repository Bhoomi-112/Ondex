import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";
import { ValidationError } from "../lib/errors.js";

export function validate(
  schema: ZodSchema,
  source: "body" | "query" | "params" = "body",
): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const details = Object.fromEntries(
        result.error.issues.map((issue) => [
          issue.path.join("."),
          issue.message,
        ]),
      );
      next(new ValidationError("Validation failed", details));
      return;
    }

    req[source] = result.data;
    next();
  };
}

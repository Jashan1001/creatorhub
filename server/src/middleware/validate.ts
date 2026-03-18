import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate body (extend later if needed)
      const parsed = schema.parse(req.body);
      req.body = parsed;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          message: "Validation error",
          errors: err.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
        return;
      }

      next(err);
    }
  };

export default validate;
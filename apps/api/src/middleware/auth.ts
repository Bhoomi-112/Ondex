import type { RequestHandler } from "express";
import { UnauthorizedError } from "../lib/errors.js";
import * as authService from "../services/auth.service.js";

export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const sessionId =
      req.cookies?.session ??
      (() => {
        const header = req.headers.authorization;
        if (header?.startsWith("Bearer ")) return header.slice(7);
        return undefined;
      })();

    if (!sessionId) {
      throw new UnauthorizedError("Missing session");
    }

    const wallet = await authService.validateSession(sessionId);
    res.locals.wallet = wallet;
    next();
  } catch (err) {
    next(err);
  }
};

export const optionalAuth: RequestHandler = async (req, res, next) => {
  try {
    const sessionId =
      req.cookies?.session ??
      (() => {
        const header = req.headers.authorization;
        if (header?.startsWith("Bearer ")) return header.slice(7);
        return undefined;
      })();

    if (sessionId) {
      const wallet = await authService.validateSession(sessionId);
      res.locals.wallet = wallet;
    }

    next();
  } catch {
    next();
  }
};

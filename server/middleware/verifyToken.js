import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const verifyToken = (req, _res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return next(createError(401, "You are not authenticated."));
    }

    const token = authorization.slice("Bearer ".length).trim();

    if (!token) {
      return next(createError(401, "You are not authenticated."));
    }

    req.user = jwt.verify(token, process.env.JWT);
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(createError(401, "Your session has expired. Please sign in again."));
    }

    return next(createError(401, "Invalid authentication token."));
  }
};

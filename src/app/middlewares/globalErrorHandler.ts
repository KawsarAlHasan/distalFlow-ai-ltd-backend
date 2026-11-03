import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import {
  handlePrismaClientKnownRequestError,
  handlePrismaValidationError,
} from "../../errors/handlePrismaError";
import handleZodError from "../../errors/handleZodError";
import { errorLogger } from "../../shared/logger";
import { IErrorMessage } from "../../types/errors.types";

// runtime error
const isPrismaKnownRequestError = (error: any): boolean => {
  return (
    error?.constructor?.name === "PrismaClientKnownRequestError" &&
    typeof error?.code === "string" &&
    error?.code.startsWith("P")
  );
};

const isPrismaValidationError = (error: any): boolean => {
  return error?.constructor?.name === "PrismaClientValidationError";
};

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  config.node_env === "development"
    ? console.log("🚨 globalErrorHandler ~~ ", error)
    : errorLogger.error("🚨 globalErrorHandler ~~ ", error);

  let statusCode = 500;
  let message = "Something went wrong";
  let errorMessages: IErrorMessage[] = [];

  // Zod Error
  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  }

  // Prisma Known Request Error (P2002, P2025 etc.)
  else if (isPrismaKnownRequestError(error)) {
    const simplifiedError = handlePrismaClientKnownRequestError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  }

  // Prisma Validation Error
  else if (isPrismaValidationError(error)) {
    const simplifiedError = handlePrismaValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  }

  // Custom API Error
  else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessages = [{ path: "", message: error.message }];
  }

  // Generic Error
  else if (error instanceof Error) {
    message = error.message;
    errorMessages = [{ path: "", message: error.message }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.node_env !== "production" ? error.stack : undefined,
  });
};

export default globalErrorHandler;

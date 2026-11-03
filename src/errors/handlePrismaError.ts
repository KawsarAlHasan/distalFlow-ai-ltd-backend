import { IErrorMessage } from "../types/errors.types";

// Prisma error codes
interface PrismaKnownError {
  code: string;
  meta?: Record<string, unknown>;
  message: string;
}

const handlePrismaClientKnownRequestError = (error: PrismaKnownError) => {
  let statusCode = 400;
  let message = "Database Error";
  let errorMessages: IErrorMessage[] = [];

  switch (error.code) {
    case "P2002": {
      const fields = error.meta?.target as string[];
      message = "Unique constraint violation";
      errorMessages = fields?.map((field) => ({
        path: field,
        message: `${field} already exists`,
      })) ?? [{ path: "", message: "Duplicate entry" }];
      break;
    }
    case "P2025": {
      statusCode = 404;
      message = "Record not found";
      errorMessages = [
        {
          path: "",
          message:
            (error.meta?.cause as string) ?? "Requested record does not exist",
        },
      ];
      break;
    }
    case "P2003": {
      const field = error.meta?.field_name as string;
      message = "Foreign key constraint failed";
      errorMessages = [
        {
          path: field ?? "",
          message: `Related record not found for field: ${field}`,
        },
      ];
      break;
    }
    case "P2011": {
      const field = error.meta?.constraint as string;
      message = "Null constraint violation";
      errorMessages = [
        {
          path: field ?? "",
          message: `${field} cannot be null`,
        },
      ];
      break;
    }
    default: {
      message = `Prisma error code: ${error.code}`;
      errorMessages = [{ path: "", message: error.message }];
    }
  }

  return { statusCode, message, errorMessages };
};

const handlePrismaValidationError = (error: Error) => {
  const match = error.message.match(/Argument `(\w+)`/);
  const field = match ? match[1] : "";

  return {
    statusCode: 400,
    message: "Validation Error",
    errorMessages: [
      {
        path: field,
        message: "Invalid value or missing required field",
      },
    ] as IErrorMessage[],
  };
};

export { handlePrismaClientKnownRequestError, handlePrismaValidationError };
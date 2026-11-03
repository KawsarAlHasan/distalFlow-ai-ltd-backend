import path from "path";
import DailyRotateFile from "winston-daily-rotate-file";
import { createLogger, format, transports } from "winston";

const { combine, timestamp, label, printf, errors } = format;

// ✅ Custom log format
const myFormat = printf((info) => {
  const { level, message, label, timestamp, stack } = info as {
    level: string;
    message: string;
    label?: string;
    timestamp?: string;
    stack?: string;
  };

  const date = timestamp ? new Date(timestamp) : new Date();

  const formattedTime = `${date.toDateString()} ${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;

  // if error has stack
  return stack
    ? `${formattedTime} [${label}] ${level}: ${message} \n${stack}`
    : `${formattedTime} [${label}] ${level}: ${message}`;
});

// ✅ Success Logger
const logger = createLogger({
  level: "info",
  format: combine(
    errors({ stack: true }),
    label({ label: "SIMPLY-GOOD-FOOD" }),
    timestamp(),
    myFormat,
  ),
  transports: [
    new transports.Console(),

    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        "winston",
        "success",
        "%DATE%-success.log",
      ),
      datePattern: "DD-MM-YYYY-HH",
      maxSize: "20m",
      maxFiles: "1d",
    }),
  ],
});

// ✅ Error Logger
const errorLogger = createLogger({
  level: "error",
  format: combine(
    errors({ stack: true }),
    label({ label: "SIMPLY-GOOD-FOOD" }),
    timestamp(),
    myFormat,
  ),
  transports: [
    new transports.Console(),

    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        "winston",
        "error",
        "%DATE%-error.log",
      ),
      datePattern: "DD-MM-YYYY-HH",
      maxSize: "20m",
      maxFiles: "1d",
    }),
  ],
});

export { logger, errorLogger };

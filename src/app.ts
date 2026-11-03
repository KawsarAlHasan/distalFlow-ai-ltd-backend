import cors from "cors";
import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bodyParser from "body-parser";
import path from "path";

import helmet from "helmet";
import compression from "compression";

import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./routes";
import webhookRouter from "./routes/webhook";
const app = express();

// CORS configuration
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Security middleware
app.use(helmet());

// Response compression
app.use(compression());

app.use("/api", webhookRouter);

// Body parser for other routes (after webhook)
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//file retrieve
app.use(express.static("uploads"));

//router
app.use("/api/v1", router);

//live response
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../uploads", "index.html"));
});

//global error handle
app.use(globalErrorHandler);

//handle not found route;
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "API DOESN'T EXIST",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API DOESN'T EXIST",
      },
    ],
  });
});

export default app;

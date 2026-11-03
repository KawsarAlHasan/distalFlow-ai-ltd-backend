import { Response } from "express";

type IErrorResponse = {
  statusCode: number;
  message: string;
  error?: any;
};

export const sendErrorResponse = (res: Response, data: IErrorResponse) => {
  res.status(data.statusCode).json({
    success: false,
    message: data.message,
    error: data.error,
  });
};


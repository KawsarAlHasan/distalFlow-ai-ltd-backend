import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { clinicCreateService } from "./clinic.service";

// create new Clinic
export const createNewClinic = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payload } = req.body;

    const result = await clinicCreateService(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Clinic created successfully",
      data: result,
    });
  },
);



// // get all Admin
// export const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
//   const result = await getAllAdminService(req.query);

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: "Admin fetched successfully",
//     data: result,
//   });
// });

// // Update an existing Admin
// export const updateAdmin = catchAsync(async (req: Request, res: Response) => {
//   const { ...adminData } = req.body;

//   const result = await updateAdminService(adminData);

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: "Admin updated successfully",
//     data: result,
//   });
// });

// // Update an existing Admin
// export const adminStatusChange = catchAsync(
//   async (req: Request, res: Response) => {
//     const { ...adminData } = req.body;

//     const result = await adminStatusChangeService(adminData);

//     sendResponse(res, {
//       success: true,
//       statusCode: StatusCodes.OK,
//       message: "Admin status updated successfully",
//       data: result,
//     });
//   },
// );

// // Delete an existing Admin
// export const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
//   const adminId = req.params.id;

//   await deleteAdminService(adminId);

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: "Admin deleted successfully",
//   });
// });

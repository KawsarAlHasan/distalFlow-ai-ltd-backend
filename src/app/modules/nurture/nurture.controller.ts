import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { createNurtureSequenceService } from "./nurture.service";

// create nurture sequence
export const createNurtureSequence = catchAsync(
  async (req: Request, res: Response) => {
    const clinicAdmin = (req as any).decodedClinicAdmin;

    const payload = {
      ...req.body,
      clinicId: clinicAdmin.id,
    };

    const result = await createNurtureSequenceService(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Nurture sequence created successfully",
      data: result,
    });
  },
);

// // Update an existing user
// export const userStatusChange = catchAsync(
//   async (req: Request, res: Response) => {
//     const { ...userData } = req.body;

//     const result = await userStatusChangeService(userData);

//     sendResponse(res, {
//       success: true,
//       statusCode: StatusCodes.OK,
//       message: "User status updated successfully",
//       data: result,
//     });
//   },
// );

// // Update user own data
// export const updateUserOwnData = catchAsync(
//   async (req: Request, res: Response) => {
//     const user = (req as any).decodedUser;

//     const payload = {
//       existUser: user,
//       ...req.body,
//     };

//     const result = await updateUserDataService(payload);

//     sendResponse(res, {
//       success: true,
//       statusCode: StatusCodes.OK,
//       message: "User updated successfully",
//       data: result,
//     });
//   },
// );

// // Update user image
// export const updateUserImage = catchAsync(
//   async (req: Request, res: Response) => {
//     const user = (req as any).decodedUser;

//     let image;
//     if (req.files && "image" in req.files && req.files.image[0]) {
//       // Build base URL for uploaded file access
//       const baseUrl = `${req.protocol}://${req.get("host")}`;

//       image = `${baseUrl}/images/${req.files.image[0].filename}`;
//     }

//     const payload = {
//       existUser: user,
//       profile: image,
//     };

//     const result = await updateUserImageService(payload);

//     sendResponse(res, {
//       success: true,
//       statusCode: StatusCodes.OK,
//       message: "User image updated successfully",
//       data: result,
//     });
//   },
// );

// // Delete an existing User
// export const deleteUser = catchAsync(async (req: Request, res: Response) => {
//   const userId = req.params.id;

//   await deleteUserService(userId);

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: "User deleted successfully",
//   });
// });

import { Request } from "express";

// Resolve Company ID
export const resolveCompanyId = (req: Request): string => {
  const decodedAdmin = (req as any).decodedAdmin;
  const decodedClient = (req as any).decodedClient;
  const decodedUser = (req as any).decodedUser;

  // Admin get companyId from body
  if (decodedAdmin) {
    return req?.body?.companyId;
  }

  // user token get companyId
  if (decodedUser) {
    return decodedUser.companyId;
  }

  // Client token get companyId
  return decodedClient.companyId;
};

// Resolve Rig ID
export const resolveRigId = (req: Request): string => {
  const decodedAdmin = (req as any).decodedAdmin;
  const decodedClient = (req as any).decodedClient;
  const decodedUser = (req as any).decodedUser;

  // Admin get rigId from body
  if (decodedAdmin) {
    return req?.body?.rigId;
  }

  // User token
  if (decodedUser) {
    return decodedUser.rigId;
  }

  // Client token
  return decodedClient.rigId;
};

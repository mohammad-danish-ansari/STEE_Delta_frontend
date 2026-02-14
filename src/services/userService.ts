import { deleteApi, getApi, postApi, putsApi } from "./api";

export const adminLogin = async (data: any) =>
  postApi("/v1/website/user/adminLogin", data);

export const createCandidate = (data: any) =>
  postApi("/v1/website/user/createCandidate", data);

export const updateUserByAdmin = (id: string, data: any) =>
  putsApi(`/v1/website/user/admin/updateUserByAdmin/${id}`,data);

  export const deleteUserByAdmin = (id: string) =>
  deleteApi(`/v1/website/user/admin/deleteUserByAdmin/${id}`);

export const getAdminProfile = () =>
  getApi("/v1/website/user/getAdminProfile");

export const sendOtp = (data: any) =>
  postApi("/v1/website/user/candidate/sendOtp", data);

export const verifyOtp = (data: any) =>
  postApi("/v1/website/user/candidate/verifyOtp", data);

export const getAllCandidates = () =>
  getApi("/v1/website/user/admin/candidates");

export const getCandidateProfile = () =>
  getApi("/v1/website/user/candidate/profile");


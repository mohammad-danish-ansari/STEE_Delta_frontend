import { deleteApi, getApi, postApi, putsApi } from "./api";


export const createQuestion = (data: any) =>
  postApi("/v1/website/question/admin/createAdminQuestions", data);

// Get All Questions (Admin View)
export const getAdminQuestions = () =>
  getApi("/v1/website/question/admin/getAllAdminQuestions");

export const updateQuestion = (id: string, data: any) =>
  putsApi(`/v1/website/question/admin/updateQuestion/${id}`, data);

export const deleteAdminQuestion = (id: string) =>
  deleteApi(`/v1/website/question/admin/deleteQuestion/${id}`);



// Candidate gets all active questions
export const getAllCandidateQuestions = () =>
  getApi("/v1/website/question/candidate/getCandidateQuestions");

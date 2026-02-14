import { deleteApi, getApi, postApi, putsApi } from "./api";

export const startCandidateAssessment = () =>
  postApi("/v1/website/attempt/candidate/startAssessment");

export const getTimer = (attemptId: string) =>
  getApi(`/v1/website/attempt/candidate/${attemptId}/timer`);

export const getAllQuestions = () =>
  getApi(`/v1/website/attempt/candidate`);

export const submitCandidateAttempt = (attemptId: string, body: any) =>
  postApi(`/v1/website/attempt/candidate/${attemptId}/submit`, body);

  export const deleteAttemptByAdmin = (attemptId: string) =>
    deleteApi(`/v1/website/attempt/admin/attempt/${attemptId}`);

export const candidateAttemptResult = () =>
getApi("/v1/website/attempt/candidate/getAllAttemptResult");


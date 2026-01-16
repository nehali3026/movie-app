import api from "./api.js";

export const loginApi = (payload: {
  email: string;
  password: string;
}) => {
  return api.post("/auth/login", payload);
};

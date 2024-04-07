import { LoginParams, RegisterParams } from "../types/api";
import axiosClient from "./axiosClient";

const authApi = {
	register: (params: RegisterParams) =>
		axiosClient.post("auth/register", params),
	login: (params: LoginParams) => axiosClient.post("auth/login", params),
	verifyToken: () => axiosClient.post("auth/verify-token"),
};

export default authApi;

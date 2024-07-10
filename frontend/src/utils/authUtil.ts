import { AxiosResponse } from "axios";
import authApi from "../api/authApi";

const authUtils = {
	// Jwt Check
	isAuthenticated: async () => {
		const token = localStorage.getItem("token");
		// console.log("token: ", token);
		if (!token) return false;
		try {
			const res: AxiosResponse = await authApi.verifyToken();
			return res.data.user;
		} catch (e: any) {
			if (e.status === 401) {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
			}
			return false;
		}
	},
};

export default authUtils;

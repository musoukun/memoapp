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
			if (res.status !== 200) return false;
			return res.data.user;
		} catch (e) {
			return false;
		}
	},
};

export default authUtils;

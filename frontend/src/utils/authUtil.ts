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
<<<<<<< HEAD
			return res.data.user;
		} catch (e: any) {
			if (e.status === 401) {
=======

			return res.data.user;
		} catch (e: any) {
			if (e.status === 400) {
>>>>>>> 32d9c58 (カンバン機能の立て直し、設計と実装をすべてやり直した。残りは永続化のみ)
				localStorage.removeItem("token");
				localStorage.removeItem("user");
			}
			return false;
		}
	},
};

export default authUtils;

import axios, { AxiosResponse } from "axios";
import queryString from "query-string";

const BASE_URL = "http://localhost:3000/api/v1";
const getToken = (): string | null => localStorage.getItem("token");

const axiosClient = axios.create({
	baseURL: BASE_URL,
	paramsSerializer: (params) => queryString.stringify({ params }),
});

axiosClient.interceptors.request.use(async (config: any) => {
	return {
		...config,
		headers: {
			...config.headers,
			"Content-Type": "application/json",
			authorization: `Bearer ${getToken()}`,
		},
	};
});

axiosClient.interceptors.response.use(
	(response: AxiosResponse) => {
		// if (response && response.data) return response.data;
		return response;
	},
	(err) => {
		if (!err.response) {
			return alert(err);
		}
		throw err.response;
	}
);

export default axiosClient;

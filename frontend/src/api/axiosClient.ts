import axios, { AxiosError, AxiosResponse } from "axios";
import queryString from "query-string";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getToken = (): string | null => localStorage.getItem("token");

console.log(getToken);
const axiosClient = axios.create({
	baseURL: BASE_URL,
	paramsSerializer: (params: Record<string, any>) =>
		queryString.stringify({ params }),
});
console.log(axiosClient);

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
	(err: AxiosError) => {
		if (!err.response) {
			return alert(err);
		}
		throw err.response;
	}
);

export default axiosClient;

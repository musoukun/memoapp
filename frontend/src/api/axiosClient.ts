import axios, { AxiosResponse } from "axios";
import queryString from "query-string";

// const BASE_URL = "http://localhost:3000/api"; //ruby on rails backend
// const BASE_URL = "http://localhost:5000/api"; //typescript backend
const BASE_URL = "https://tsbackend-b2ztukr2v-musoukuns-projects.vercel.app/"; //typescript backend

const getToken = (): string | null => localStorage.getItem("token");

console.log(getToken);
const axiosClient = axios.create({
	baseURL: BASE_URL,
	paramsSerializer: (params) => queryString.stringify({ params }),
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
	(err) => {
		if (!err.response) {
			return alert(err);
		}
		throw err.response;
	}
);

export default axiosClient;

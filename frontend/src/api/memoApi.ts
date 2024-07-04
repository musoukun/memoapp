import axiosClient from "./axiosClient";

const memoApi = {
	create: () => axiosClient.post("memo"),
	getAll: () => axiosClient.get("memo"),
	updatePosition: (params: any) => axiosClient.put("memo", params),
	show: (id: string) => axiosClient.get(`memo/${id}`),
	update: (id: string, params: any) => axiosClient.put(`memo/${id}`, params),
	getFavorites: () => axiosClient.get("memo/favorites"),
	delete: (id: string) => axiosClient.delete(`memo/${id}`),
	recent: (user: any) => axiosClient.get("memo/recent", user),
};

export default memoApi;

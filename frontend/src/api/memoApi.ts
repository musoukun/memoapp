import axiosClient from "./axiosClient";

const memoApi = {
	create: (title: string) => axiosClient.post("memo", title),
	getAll: () => axiosClient.get("memo"),
	updatePosition: (params: any) => axiosClient.put("memo", params),
	show: (id: string) => axiosClient.get(`memo/${id}`),
	update: (id: string, params: any) => axiosClient.put(`memo/${id}`, params),
	getFavorites: () => axiosClient.get("memo/favorites"),
	delete: (id: string) => axiosClient.delete(`memo/${id}`),
};

export default memoApi;

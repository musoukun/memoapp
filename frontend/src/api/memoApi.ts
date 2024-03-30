import axiosClient from "./axiosClient";

const memoApi = {
	create: () => axiosClient.post("memos"),
	getAll: () => axiosClient.get("memos"),
	updatePosition: (params: any) => axiosClient.put("memos", params),
	show: (id: string) => axiosClient.get(`memos/${id}`),
	update: (id: string, params: any) =>
		axiosClient.patch(`memos/${id}`, params),
	getFavorites: () => axiosClient.get("memos/favorites"),
	delete: (id: string) => axiosClient.delete(`memos/${id}`),
};

export default memoApi;

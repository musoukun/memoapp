import axiosClient from "./axiosClient";

const noteApi = {
	create: () => axiosClient.post("note"),
	getAll: () => axiosClient.get("note"),
	updatePosition: (params: any) => axiosClient.put("note", params),
	show: (id: string) => axiosClient.get(`note/${id}`),
	update: (id: string, params: any) => axiosClient.put(`note/${id}`, params),
	getFavorites: () => axiosClient.get("note/favorites"),
	delete: (id: string) => axiosClient.delete(`note/${id}`),
	recent: (user: any) => axiosClient.get("note/recent", user),
};

export default noteApi;

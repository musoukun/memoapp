import axiosClient from "./axiosClient";

const kanbanApi = {
	create: (home?: boolean) => axiosClient.post("kanban", home),
	getAll: () => axiosClient.get("kanban"),
	update: (id: string, data: any) => axiosClient.put(`kanban/${id}`, data),
	show: (id: string) => axiosClient.get(`kanban/${id}`),
	home: () => axiosClient.get(`kanban/home`),
	delete: (id: string) => axiosClient.delete(`kanban/${id}`),
};

export default kanbanApi;

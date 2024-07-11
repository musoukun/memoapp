import { AxiosPromise } from "axios";
import axiosClient from "./axiosClient";
import { Kanban, KanbanColumn } from "../types/kanban";

const kanbanApi = {
	create: (params: {
		title: string;
		columns: KanbanColumn[];
	}): AxiosPromise<Kanban> => axiosClient.post("kanban", params),

	getKanbans: (): AxiosPromise<Kanban[]> => axiosClient.get("kanban"),

	getMainKanban: (): AxiosPromise<Kanban> => axiosClient.get("kanban/main"),

	getKanban: (id: string): AxiosPromise<Kanban> =>
		axiosClient.get(`kanban/${id}`),
	update: (
		id: string,
		params: { title: string; icon: string; data: KanbanColumn[] }
	): AxiosPromise<Kanban> => axiosClient.put(`kanban/${id}`, params),

	delete: (id: string): AxiosPromise<void> =>
		axiosClient.delete(`kanban/${id}`),

	// 以下のメソッドはバックエンドの実装に含まれていないため、コメントアウト

	// addColumn: (kanbanId: string, params: { title: string }) =>
	//     axiosClient.post(`kanban/${kanbanId}/columns`, params),
	// updateColumn: (id: string, params: { title: string }) =>
	//     axiosClient.put(`kanban/columns/${id}`, params),
	// deleteColumn: (id: string) => axiosClient.delete(`kanban/columns/${id}`),

	// addCard: (
	//     columnId: string,
	//     params: { title: string; description?: string; status?: string }
	// ) => axiosClient.post(`kanban/columns/${columnId}/cards`, params),
	// updateCard: (id: string, params: any) =>
	//     axiosClient.put(`kanban/cards/${id}`, params),
	// deleteCard: (id: string) => axiosClient.delete(`kanban/cards/${id}`),
	// moveCard: (params: { cardId: string; newColumnId: string }) =>
	//     axiosClient.post("kanban/cards/move", params),
};

export default kanbanApi;

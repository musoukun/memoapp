import { AxiosPromise } from "axios";
import { Kanban, KanbanColumn, KanbanCard } from "../types/kanban";
import axiosClient from "./axiosClient";

const kanbanApi = {
	create: (params: { title: string; main?: boolean }): AxiosPromise<Kanban> =>
		axiosClient.post("kanban", params),

	getUserKanbans: (): AxiosPromise<Kanban[]> =>
		axiosClient.get("kanban/userkanbans"),
	getMainKanban: (): AxiosPromise<Kanban[]> => axiosClient.get("kanban/main"),
	getKanban: (id: string): AxiosPromise<Kanban> =>
		axiosClient.get(`kanban/${id}`),
	update: (id: string, params: { title: string }): AxiosPromise<Kanban> =>
		axiosClient.put(`kanban/${id}`, params),
	delete: (id: string): AxiosPromise<void> =>
		axiosClient.delete(`kanban/${id}`),

	addColumn: (
		kanbanId: string,
		params: { title: string }
	): AxiosPromise<KanbanColumn> =>
		axiosClient.post(`kanban/${kanbanId}/columns`, params),
	updateColumn: (
		id: string,
		params: { title: string }
	): AxiosPromise<KanbanColumn> =>
		axiosClient.put(`kanban/columns/${id}`, params),
	deleteColumn: (id: string): AxiosPromise<void> =>
		axiosClient.delete(`kanban/columns/${id}`),

	addCard: (
		columnId: string,
		params: { title: string; description?: string; status?: string }
	): AxiosPromise<KanbanCard> =>
		axiosClient.post(`kanban/columns/${columnId}/cards`, params),
	updateCard: (id: string, params: any): AxiosPromise<KanbanCard> =>
		axiosClient.put(`kanban/cards/${id}`, params),
	deleteCard: (id: string): AxiosPromise<void> =>
		axiosClient.delete(`kanban/cards/${id}`),
	moveCard: (params: {
		cardId: string;
		newColumnId: string;
	}): AxiosPromise<void> => axiosClient.post("kanban/cards/move", params),
};

export default kanbanApi;

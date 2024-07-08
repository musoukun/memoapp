import axiosClient from "./axiosClient";
import { Kanban, KanbanColumn, KanbanCard } from "../types/kanban";

const kanbanApi = {
	create: () => axiosClient.post<Kanban>("kanban"),
	getAll: () => axiosClient.get<Kanban[]>("kanban"),
	update: (id: string, data: Partial<Kanban>) =>
		axiosClient.put<Kanban>(`kanban/${id}`, data),
	getOne: (id: string) => axiosClient.get<Kanban>(`kanban/${id}`),
	home: () => axiosClient.get<Kanban>(`kanban/home`),
	delete: (id: string) => axiosClient.delete(`kanban/${id}`),

	addColumn: (kanbanId: string, data: Partial<KanbanColumn>) =>
		axiosClient.post<KanbanColumn>(`kanban/${kanbanId}/column`, data),

	updateColumn: (
		kanbanId: string,
		columnId: string,
		data: Partial<KanbanColumn>
	) =>
		axiosClient.put<KanbanColumn>(
			`kanban/${kanbanId}/column/${columnId}`,
			data
		),

	deleteColumn: (kanbanId: string, columnId: string) =>
		axiosClient.delete(`kanban/${kanbanId}/column/${columnId}`),

	addCard: (kanbanId: string, columnId: string, data: Partial<KanbanCard>) =>
		axiosClient.post<KanbanCard>(
			`kanban/${kanbanId}/column/${columnId}/card`,
			data
		),
	deleteCard: (kanbanId: string, columnId: string, cardId: string) =>
		axiosClient.delete(
			`kanban/${kanbanId}/column/${columnId}/card/${cardId}`
		),
	updateCard: (
		kanbanId: string,
		columnId: string,
		cardId: string,
		data: Partial<KanbanCard>
	) =>
		axiosClient.put<KanbanCard>(
			`kanban/${kanbanId}/column/${columnId}/card/${cardId}`,
			data
		),
	moveCard: (
		kanbanId: string,
		fromColumnId: string,
		toColumnId: string,
		cardId: string,
		newIndex: number
	) =>
		axiosClient.put<KanbanCard>(`kanban/${kanbanId}/move-card/${cardId}`, {
			fromColumnId,
			toColumnId,
			newIndex,
		}),
};

export default kanbanApi;

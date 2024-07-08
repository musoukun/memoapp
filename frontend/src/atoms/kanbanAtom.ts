import { atom, atomFamily } from "recoil";
import { Kanban, KanbanCard, KanbanColumn } from "../types/kanban";

export const kanbanState = atom<Kanban>({
	key: "kanbanState",
	default: {
		id: "",
		title: "",
		columns: [],
	},
});

export const kanbansState = atom<Kanban[]>({
	key: "kanbansState",
	default: [],
});

export const kanbanColumnState = atom<KanbanColumn | null>({
	key: "columnState",
	default: null,
});

export const kanbanCardState = atom<KanbanCard | null>({
	key: "cardState",
	default: null,
});

export const selectedCardState = atom<KanbanCard | null>({
	key: "selectedCardState",
	default: null,
});

export const columnFamily = atomFamily<KanbanColumn, string>({
	key: "columnFamily",
	default: (columnId: string) => ({
		id: columnId,
		title: "",
		cards: [],
	}),
});

export const cardFamily = atomFamily<KanbanCard, string>({
	key: "cardFamily",
	default: (cardId: string) => ({
		id: cardId,
		title: "",
		columnId: "",
	}),
});

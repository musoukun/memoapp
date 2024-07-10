import { KanbanCard, KanbanColumn } from "../types/kanban";
import { v4 as uuidv4 } from "uuid";

export const findColumnById = (
	columns: KanbanColumn[],
	id: string
): KanbanColumn | undefined => {
	return columns.find(
		(col) => col.id === id || col.cards.some((card) => card.id === id)
	);
};

export const createNewCard = (title: string = "新しいカード"): KanbanCard => ({
	id: uuidv4(),
	title,
	description: "",
});

export const createNewColumn = (title: string = "新しい列"): KanbanColumn => ({
	id: uuidv4(),
	title,
	cards: [],
});

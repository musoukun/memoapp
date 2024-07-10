export type Kanban = {
	id: string;
	title: string;
	columns: KanbanColumn[];
};

export type KanbanColumn = {
	id: string;
	title: string;
	cards: KanbanCard[];
};

export type KanbanCard = {
	id: string;
	title: string;
	description: string;
	status: string;
};

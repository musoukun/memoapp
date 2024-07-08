import { Kanban, KanbanCard, KanbanColumn } from "@prisma/client";

export interface KanbanUpdateInput {
	title: string;
	columns: ColumnUpdateInput[];
}

export interface ColumnUpdateInput {
	id?: string;
	title: string;
	cards: CardUpdateInput[];
}

export interface CardUpdateInput {
	id?: string;
	title: string;
	status?: string;
	assignee?: string;
	dueDate?: Date;
	notes?: string;
}

export interface KanbanWithRelations extends Kanban {
	columns: (KanbanColumn & { cards: KanbanCard[] })[];
}

export interface KanbanCard {
	id: string;
	title: string;
	status?: string;
	assignee?: string;
	dueDate?: string;
	notes?: string;
	columnId?: string;
}

export interface KanbanColumn {
	id: string;
	title: string;
	cards: KanbanCard[];
}

export interface Kanban {
	id: string;
	title: string;
	columns: KanbanColumn[];
}

export interface KanbanContextType {
	kanban: Kanban | null;
	setKanban: React.Dispatch<React.SetStateAction<Kanban | null>>;
	selectedCard: KanbanCard | null;
	setSelectedCard: React.Dispatch<React.SetStateAction<KanbanCard | null>>;
	error: string | null;
	setError: React.Dispatch<React.SetStateAction<string | null>>;
}

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
<<<<<<< HEAD
	description: string;
	status: string;
=======
	description?: string;
	status?: string;
>>>>>>> 32d9c58 (カンバン機能の立て直し、設計と実装をすべてやり直した。残りは永続化のみ)
};

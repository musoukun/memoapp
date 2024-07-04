export interface Card {
	id: string;
	title: string;
	status?: string;
	assignee?: string;
	dueDate?: string;
	notes?: string;
}

export interface Column {
	id: string;
	title: string;
	cards: Card[];
}

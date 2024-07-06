export type Column = {
	id: string;
	ColumnTitle: string;
	cards: Card[];
};

// 配列版の型定義
export type ColumnArray = {
	id: string;
	ColumnTitle: string;
	cards: Card[];
}[];

export type Card = {
	id: string;
	title: string;
	status?: string;
	assignee?: string;
	dueDate?: string;
	notes?: string;
};

export type Kanban = {
	id: string;
	title: string;
	data: Column[];
	createdAt: string;
	updatedAt: string;
	userId: string;
	home: boolean;
};

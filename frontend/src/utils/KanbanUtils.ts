import { KanbanColumn, KanbanCard, Kanban } from "../types/kanban";

// カラムを更新する関数
export const updateColumn = (
	kanban: Kanban, // 更新対象のカンバン
	columnId: string, // 更新対象のカラムID
	updateFn: (column: KanbanColumn) => KanbanColumn // カラムを更新する関数
): Kanban => ({
	...kanban, // カンバン全体をコピー
	// カラムを更新
	// kanbanのcolumnsをmapで回して、カラムIDがcolumnIdの場合はupdateFnを適用
	columns: kanban.columns.map((col: KanbanColumn) =>
		col.id === columnId ? updateFn(col) : col
	),
});

// カードを更新する関数
export const updateCard = (
	column: KanbanColumn, // 更新対象のカラム
	cardId: string, // 更新対象のカードID
	updateFn: (card: KanbanCard) => KanbanCard // カードを更新する関数
): KanbanColumn => ({
	...column,
	// カラムのカードをmapで回して、カードIDがcardIdの場合はupdateFnを適用
	cards: column.cards.map((card) =>
		card.id === cardId ? updateFn(card) : card
	),
});

// カードIDからカラムを取得する関数
export const findColumnByCardId = (
	kanban: Kanban,
	cardId: string
): KanbanColumn | undefined =>
	// カンバンのカラムをfindで回して、カードIDがcardIdのカラムを取得
	kanban.columns.find((col) => col.cards.some((card) => card.id === cardId));

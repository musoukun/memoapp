import { useCallback } from "react";
import { DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Kanban, KanbanColumn } from "../types/kanban";

const findColumnById = (
	columns: KanbanColumn[],
	id: string
): KanbanColumn | undefined => {
	return columns.find(
		(col) => col.id === id || col.cards.some((card) => card.id === id)
	);
};

export const useKanbanDnD = (
	kanban: Kanban | null,
	updateKanban: (updater: (prevKanban: Kanban) => Kanban | null) => void
) => {
	const handleDragOver = useCallback(
		(event: DragOverEvent) => {
			if (!kanban) return;

			const { active, over } = event;
			if (!over) return;

			const activeId = active.id.toString();
			const overId = over.id.toString();

			const activeColumn = findColumnById(kanban.columns, activeId);
			const overColumn = findColumnById(kanban.columns, overId);

			if (!activeColumn || !overColumn || activeColumn === overColumn) {
				return;
			}

			updateKanban((prevKanban) => ({
				...prevKanban,
				columns: prevKanban.columns.map((col) => {
					if (col.id === activeColumn.id) {
						return {
							...col,
							cards: col.cards.filter(
								(card) => card.id !== activeId
							),
						};
					}
					if (col.id === overColumn.id) {
						const movedCard = activeColumn.cards.find(
							(card) => card.id === activeId
						);
						return {
							...col,
							cards: [...col.cards, movedCard!],
						};
					}
					return col;
				}),
			}));
		},
		[kanban, updateKanban]
	);

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			if (!kanban) return;

			const { active, over } = event;
			if (!over) return;

			const activeId = active.id.toString();
			const overId = over.id.toString();

			const activeColumn = findColumnById(kanban.columns, activeId);
			const overColumn = findColumnById(kanban.columns, overId);

			if (!activeColumn || !overColumn) {
				return;
			}

			if (activeColumn !== overColumn) {
				// カードが異なる列に移動された場合の処理
				updateKanban((prevKanban) => ({
					...prevKanban,
					columns: prevKanban.columns.map((col) => {
						if (col.id === activeColumn.id) {
							return {
								...col,
								cards: col.cards.filter(
									(card) => card.id !== activeId
								),
							};
						}
						if (col.id === overColumn.id) {
							const movedCard = activeColumn.cards.find(
								(card) => card.id === activeId
							);
							return {
								...col,
								cards: [...col.cards, movedCard!],
							};
						}
						return col;
					}),
				}));
			} else {
				// 同じ列内でカードの順序が変更された場合の処理
				const oldIndex = activeColumn.cards.findIndex(
					(card) => card.id === activeId
				);
				const newIndex = overColumn.cards.findIndex(
					(card) => card.id === overId
				);

				updateKanban((prevKanban) => ({
					...prevKanban,
					columns: prevKanban.columns.map((col) => {
						if (col.id === activeColumn.id) {
							return {
								...col,
								cards: arrayMove(col.cards, oldIndex, newIndex),
							};
						}
						return col;
					}),
				}));
			}
		},
		[kanban, updateKanban]
	);

	return { handleDragOver, handleDragEnd };
};

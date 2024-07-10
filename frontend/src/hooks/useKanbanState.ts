import { useState, useCallback, useEffect, useRef } from "react";
import { Kanban, KanbanColumn, KanbanCard } from "../types/kanban";
import kanbanApi from "../api/kanbanApi";
import { debounce } from "lodash";

export const useKanbanState = (
	initialKanban: Kanban | null,
	kanbanId: string
) => {
	const [kanban, setKanban] = useState<Kanban | null>(initialKanban);
	const [error, setError] = useState<string | null>(null);
	const kanbanRef = useRef(kanban);

	useEffect(() => {
		kanbanRef.current = kanban;
	}, [kanban]);

	const saveKanban = useCallback(async () => {
		if (!kanbanRef.current) return;

		try {
			await kanbanApi.update(kanbanId, {
				title: kanbanRef.current.title,
				data: kanbanRef.current.columns,
			});
		} catch (err) {
			setError("Failed to save Kanban. Please try again.");
			console.error("Error saving Kanban:", err);
		}
	}, [kanbanId]);

	const debouncedSaveKanban = useCallback(
		debounce(() => {
			saveKanban();
		}, 1000),
		[saveKanban]
	);

	const updateKanban = useCallback(
		(updater: (prevKanban: Kanban) => Kanban | null) => {
			setKanban((prevKanban) => {
				if (!prevKanban) return null;
				const updatedKanban = updater(prevKanban);
				return updatedKanban;
			});
			debouncedSaveKanban();
		},
		[debouncedSaveKanban]
	);

	const updateColumn = useCallback(
		(columnId: string, updater: (column: KanbanColumn) => KanbanColumn) => {
			updateKanban((prevKanban) => ({
				...prevKanban,
				columns: prevKanban.columns.map((col) =>
					col.id === columnId ? updater(col) : col
				),
			}));
		},
		[updateKanban]
	);

	const updateCard = useCallback(
		(
			columnId: string,
			cardId: string,
			updater: (card: KanbanCard) => KanbanCard
		) => {
			updateColumn(columnId, (column) => ({
				...column,
				cards: column.cards.map((card) =>
					card.id === cardId ? updater(card) : card
				),
			}));
		},
		[updateColumn]
	);

	return { kanban, setKanban, updateKanban, updateColumn, updateCard, error };
};

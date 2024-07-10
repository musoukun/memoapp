import {
	useSensors,
	useSensor,
	PointerSensor,
	KeyboardSensor,
	DndContext,
	closestCorners,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import kanbanApi from "../../api/kanbanApi";
import { useKanbanDnD } from "../../hooks/useKanbanDnD";
import { useKanbanState } from "../../hooks/useKanbanState";
import { Kanban, KanbanCard, KanbanColumn } from "../../types/kanban";
import { createNewCard, createNewColumn } from "../../utils/KanbanUtils";
import { CardDetails } from "./CardDetails";
import { Column } from "./Column";

interface KanbanBoardProps {
	initialKanban?: Kanban;
	height: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
	initialKanban,
	height,
}) => {
	const { id } = useParams<{ id: string }>();
	const { kanban, setKanban, updateKanban, updateColumn, updateCard, error } =
		useKanbanState(initialKanban || null, id!);
	const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const { handleDragOver, handleDragEnd } = useKanbanDnD(
		kanban,
		updateKanban
	);

	const fetchKanban = useCallback(async () => {
		if (id) {
			try {
				const response = await kanbanApi.getKanban(id);
				setKanban(response.data);
			} catch (err) {
				console.log("Failed to fetch Kanban:", err);
			}
		}
	}, [id, setKanban]);

	useEffect(() => {
		if (!initialKanban) {
			fetchKanban();
		}
	}, [fetchKanban, initialKanban]);

	const handleAddCard = useCallback(
		(columnId: string) => {
			updateColumn(columnId, (column) => ({
				...column,
				cards: [createNewCard(), ...column.cards],
			}));
		},
		[updateColumn]
	);

	const handleDeleteCard = useCallback(
		(columnId: string, cardId: string) => {
			updateColumn(columnId, (column) => ({
				...column,
				cards: column.cards.filter((card) => card.id !== cardId),
			}));
			if (selectedCard && selectedCard.id === cardId) {
				setSelectedCard(null);
			}
		},
		[updateColumn, selectedCard]
	);

	const handleUpdateCard = useCallback(
		(columnId: string, cardId: string, updatedCard: KanbanCard) => {
			updateCard(columnId, cardId, () => updatedCard);
			if (selectedCard && selectedCard.id === cardId) {
				setSelectedCard(updatedCard);
			}
		},
		[updateCard, selectedCard]
	);

	const handleAddColumn = useCallback(() => {
		updateKanban((prevKanban) => ({
			...prevKanban,
			columns: [...prevKanban.columns, createNewColumn()],
		}));
	}, [updateKanban]);

	const handleDeleteColumn = useCallback(
		(columnId: string) => {
			updateKanban((prevKanban) => ({
				...prevKanban,
				columns: prevKanban.columns.filter(
					(column) => column.id !== columnId
				),
			}));
		},
		[updateKanban]
	);

	const handleUpdateColumnTitle = useCallback(
		(columnId: string, newTitle: string) => {
			updateColumn(columnId, (column) => ({
				...column,
				title: newTitle,
			}));
		},
		[updateColumn]
	);

	if (!kanban) {
		return <div>Loading...</div>;
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
		>
			<div className={`${height} flex p-4 dark:bg-gray-800 min-h-screen`}>
				{error && <div className="text-red-500">{error}</div>}
				<div className="flex-grow overflow-x-auto">
					<div className="flex gap-4">
						{kanban.columns.map((column: KanbanColumn) => (
							<Column
								key={column.id}
								column={column}
								onAddCard={handleAddCard}
								onDeleteCard={handleDeleteCard}
								onDeleteColumn={handleDeleteColumn}
								onUpdateTitle={handleUpdateColumnTitle}
								onEditCard={setSelectedCard}
								onUpdateCard={handleUpdateCard}
							/>
						))}
						<button
							onClick={handleAddColumn}
							className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg h-min whitespace-nowrap"
						>
							+ 列を追加
						</button>
					</div>
				</div>
				{selectedCard && (
					<CardDetails
						card={selectedCard}
						onClose={() => setSelectedCard(null)}
						onUpdate={(updatedCard) => {
							const column = kanban.columns.find((col) =>
								col.cards.some((c) => c.id === selectedCard.id)
							);
							if (column) {
								handleUpdateCard(
									column.id,
									selectedCard.id,
									updatedCard as unknown as KanbanCard
								);
							}
						}}
					/>
				)}
			</div>
		</DndContext>
	);
};

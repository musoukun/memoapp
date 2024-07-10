import React from "react";
import {
	DndContext,
	closestCorners,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragOverEvent,
	DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Column } from "./Column";
import { CardDetails } from "./CardDetails";
import { useKanban } from "../../hooks/useKanban";
import { KanbanCard } from "../../types/kanban";

export const KanbanBoard: React.FC<{ kanbanId: string }> = ({ kanbanId }) => {
	const {
		kanban,
		selectedCard,
		setSelectedCard,
		loading,
		error,
		handleAddCard,
		handleDeleteCard,
		handleUpdateCard,
		handleAddColumn,
		handleDeleteColumn,
		handleUpdateColumnTitle,
		handleDragEnd,
		handleDragOver,
	} = useKanban(kanbanId);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!kanban) return <div>No kanban data available</div>;

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragEnd={(event: DragEndEvent) => {
				if (event.over) {
					handleDragEnd(
						event.active.id.toString(),
						event.over.id.toString()
					);
				}
			}}
			onDragOver={(event: DragOverEvent) => {
				if (event.over) {
					handleDragOver(
						event.active.id.toString(),
						event.over.id.toString()
					);
				}
			}}
		>
			<div className="flex h-fit overflow-hidden bg-gray-100 dark:bg-gray-900 rounded-xl">
				<div className="flex-grow p-4 overflow-hidden">
					<div className="h-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
						<div className="flex gap-4 pb-4">
							{kanban.columns.map((column) => (
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
								className="flex-shrink-0 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg whitespace-nowrap dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
							>
								+ 列を追加
							</button>
						</div>
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
									updatedCard as Partial<KanbanCard>
								);
							}
						}}
					/>
				)}
			</div>
		</DndContext>
	);
};

// KanbanBoard.tsx
import { useState } from "react";
import {
	DndContext,
	DragEndEvent,
	UniqueIdentifier,
	closestCorners,
} from "@dnd-kit/core";
import { CardDetails } from "./CardDetail";
import { Column as ColumnType, Card } from "../../types/kanban";
import { Column } from "./Column";

export interface KanbanBoardProps {
	initialColumns: ColumnType[];
}

export function KanbanBoard({ initialColumns }: KanbanBoardProps) {
	const [columns, setColumns] = useState<ColumnType[]>(initialColumns);
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeColumnId = active.data.current?.columnId;
		const overColumnId = over.id;

		if (activeColumnId !== overColumnId) {
			setColumns((prevColumns) => {
				const activeColumn = prevColumns.find(
					(col) => col.id === activeColumnId
				);
				const overColumn = prevColumns.find(
					(col) => col.id === overColumnId
				);

				if (!activeColumn || !overColumn) return prevColumns;

				const activeCardIndex = activeColumn.cards.findIndex(
					(card: { id: UniqueIdentifier }) => card.id === active.id
				);
				const [movedCard] = activeColumn.cards.splice(
					activeCardIndex,
					1
				);
				overColumn.cards.push(movedCard);

				return [...prevColumns];
			});
		}
	};

	const handleDoubleClick = (card: Card) => {
		setSelectedCard(card);
	};

	const handleClose = () => {
		setSelectedCard(null);
	};

	const handleInputChange = (field: keyof Card, value: string) => {
		setSelectedCard((prev: any) =>
			prev ? { ...prev, [field]: value } : null
		);
		setColumns((prevColumns: any) => {
			return prevColumns.map((col: any) => ({
				...col,
				cards: col.cards.map((card: { id: any }) =>
					card.id === selectedCard?.id
						? { ...card, [field]: value }
						: card
				),
			}));
		});
	};

	return (
		// 看板の縦幅に全体の高さを合わせたい
		<div className="h-full my-5">
			<div className="my-4 text-xl font-bold text-[#c9d1d9]">
				かんばん
			</div>
			<DndContext
				onDragEnd={handleDragEnd}
				collisionDetection={closestCorners}
			>
				<div className="flex gap-4">
					{columns.map((column) => (
						<Column
							key={column.id}
							column={column}
							onCardDoubleClick={handleDoubleClick}
						/>
					))}
				</div>
			</DndContext>
			{selectedCard && (
				<CardDetails
					card={selectedCard}
					onClose={handleClose}
					onInputChange={handleInputChange}
				/>
			)}
		</div>
	);
}
export default KanbanBoard;

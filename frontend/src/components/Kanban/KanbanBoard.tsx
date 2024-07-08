import React, { useState, useCallback } from "react";
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
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Column } from "./Column";

import { mockKanbanData } from "./mockKanbanData";

export type MockKanban = {
	id: string;
	title: string;
	columns: {
		id: string;
		title: string;
		cards: {
			id: string;
			title: string;
			description: string;
			status: string;
		}[];
	}[];
};

export const KanbanBoard: React.FC = () => {
	const [kanban, setKanban] = useState<MockKanban>(mockKanbanData);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const findColumn = useCallback(
		(id: string) => {
			const column = kanban.columns.find((col) => col.id === id);
			if (column) return column;

			return kanban.columns.find((col) =>
				col.cards.some((card) => card.id === id)
			);
		},
		[kanban.columns]
	);

	const handleDragOver = useCallback(
		(event: DragOverEvent) => {
			const { active, over } = event;
			const activeId = active.id.toString();
			const overId = over ? over.id.toString() : null;

			const activeColumn = findColumn(activeId);
			const overColumn = overId ? findColumn(overId) : null;

			if (!activeColumn || !overColumn || activeColumn === overColumn) {
				return;
			}

			setKanban((prevKanban) => {
				const newColumns = prevKanban.columns.map((col) => {
					if (col.id === activeColumn.id) {
						return {
							...col,
							cards: col.cards.filter(
								(card) => card.id !== activeId
							),
						};
					}
					if (col.id === overColumn.id) {
						const [movedCard] = activeColumn.cards.filter(
							(card) => card.id === activeId
						);
						return {
							...col,
							cards: [...col.cards, movedCard],
						};
					}
					return col;
				});

				return {
					...prevKanban,
					columns: newColumns,
				};
			});
		},
		[findColumn]
	);

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event;
			if (!over) return;

			const activeId = active.id.toString();
			const overId = over.id.toString();

			const activeColumn = findColumn(activeId);
			const overColumn = findColumn(overId);

			if (!activeColumn || !overColumn || activeColumn !== overColumn) {
				return;
			}

			const activeIndex = activeColumn.cards.findIndex(
				(card) => card.id === activeId
			);
			const overIndex = overColumn.cards.findIndex(
				(card) => card.id === overId
			);

			if (activeIndex !== overIndex) {
				setKanban((prevKanban) => {
					const newColumns = prevKanban.columns.map((col) => {
						if (col.id === activeColumn.id) {
							return {
								...col,
								cards: arrayMove(
									col.cards,
									activeIndex,
									overIndex
								),
							};
						}
						return col;
					});

					return {
						...prevKanban,
						columns: newColumns,
					};
				});
			}
		},
		[findColumn]
	);

	const handleAddCard = useCallback((columnId: string) => {
		const newCard = {
			id: `card-${Date.now()}`,
			title: "新しいカード",
			description: "",
			status: "",
		};

		setKanban((prevKanban) => ({
			...prevKanban,
			columns: prevKanban.columns.map((column) =>
				column.id === columnId
					? { ...column, cards: [newCard, ...column.cards] }
					: column
			),
		}));
	}, []);

	const handleDeleteCard = useCallback((columnId: string, cardId: string) => {
		setKanban((prevKanban) => ({
			...prevKanban,
			columns: prevKanban.columns.map((column) =>
				column.id === columnId
					? {
							...column,
							cards: column.cards.filter(
								(card) => card.id !== cardId
							),
						}
					: column
			),
		}));
	}, []);

	const handleAddColumn = useCallback(() => {
		const newColumn = {
			id: `column-${Date.now()}`,
			title: "新しい列",
			cards: [],
		};
		setKanban((prevKanban) => ({
			...prevKanban,
			columns: [...prevKanban.columns, newColumn],
		}));
	}, []);

	const handleDeleteColumn = useCallback((columnId: string) => {
		setKanban((prevKanban) => ({
			...prevKanban,
			columns: prevKanban.columns.filter(
				(column) => column.id !== columnId
			),
		}));
	}, []);

	const handleUpdateColumnTitle = useCallback(
		(columnId: string, newTitle: string) => {
			setKanban((prevKanban) => ({
				...prevKanban,
				columns: prevKanban.columns.map((column) =>
					column.id === columnId
						? { ...column, title: newTitle }
						: column
				),
			}));
		},
		[]
	);

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
		>
			<div className="p-4 dark:bg-gray-800 min-h-screen">
				<div className="flex gap-4 overflow-x-auto">
					{kanban.columns.map((column) => (
						<Column
							key={column.id}
							column={column}
							onAddCard={handleAddCard}
							onDeleteCard={handleDeleteCard}
							onDeleteColumn={handleDeleteColumn}
							onUpdateTitle={handleUpdateColumnTitle}
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
		</DndContext>
	);
};

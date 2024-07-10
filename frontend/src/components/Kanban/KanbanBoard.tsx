import React, { useState, useCallback, useEffect } from "react";
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
import { CardDetails } from "./CardDetails";
import { Kanban, KanbanCard, KanbanColumn } from "../../types/kanban";
import kanbanApi from "../../api/kanbanApi";
import { useParams } from "react-router-dom";

interface KanbanBoardProps {
	initialKanban?: Kanban;
	height: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
	initialKanban,
	height,
}) => {
	const { id } = useParams<{ id: string }>();
	const [kanban, setKanban] = useState<Kanban | null>(initialKanban || null);
	const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);

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

	const fetchKanban = useCallback(async () => {
		if (id) {
			try {
				const response = await kanbanApi.getKanban(id);
				setKanban(response.data);
			} catch (err) {
				console.log("Failed to fetch Kanban:", err);
			}
		}
	}, [id]);

	useEffect(() => {
		if (!initialKanban) {
			fetchKanban();
		}
	}, [fetchKanban, initialKanban]);

	const findColumn = useCallback(
		(id: string): KanbanColumn | undefined => {
			return kanban?.columns.find(
				(col: KanbanColumn) =>
					col.id === id || col.cards.some((card) => card.id === id)
			);
		},
		[kanban]
	);

	const handleDragOver = useCallback(
		(event: DragOverEvent) => {
			if (!kanban) return;

			const { active, over } = event;
			if (!over) return;

			const activeId = active.id.toString();
			const overId = over.id.toString();

			const activeColumn = findColumn(activeId);
			const overColumn = findColumn(overId);

			if (!activeColumn || !overColumn || activeColumn === overColumn) {
				return;
			}

			setKanban((prevKanban) => {
				if (!prevKanban) return null;
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
						const movedCard = activeColumn.cards.find(
							(card) => card.id === activeId
						);
						return {
							...col,
							cards: [...col.cards, movedCard!],
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
		[findColumn, kanban]
	);

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			if (!kanban) return;

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
					if (!prevKanban) return null;
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
		[findColumn, kanban]
	);

	const handleAddCard = useCallback((columnId: string) => {
		const newCard: KanbanCard = {
			id: `card-${Date.now()}`,
			title: "新しいカード",
			description: "",
		};

		setKanban((prevKanban) => {
			if (!prevKanban) return null;
			return {
				...prevKanban,
				columns: prevKanban.columns.map((column) =>
					column.id === columnId
						? { ...column, cards: [newCard, ...column.cards] }
						: column
				),
			};
		});
	}, []);

	const handleDeleteCard = useCallback(
		(columnId: string, cardId: string) => {
			setKanban((prevKanban) => {
				if (!prevKanban) return null;
				return {
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
				};
			});
			if (selectedCard && selectedCard.id === cardId) {
				setSelectedCard(null);
			}
		},
		[selectedCard]
	);

	const handleUpdateCard = useCallback(
		(columnId: string, cardId: string, updatedCard: KanbanCard) => {
			setKanban((prevKanban) => {
				if (!prevKanban) return null;
				return {
					...prevKanban,
					columns: prevKanban.columns.map((column) =>
						column.id === columnId
							? {
									...column,
									cards: column.cards.map((card) =>
										card.id === cardId ? updatedCard : card
									),
								}
							: column
					),
				};
			});
			if (selectedCard && selectedCard.id === cardId) {
				setSelectedCard(updatedCard);
			}
		},
		[selectedCard]
	);

	const handleAddColumn = useCallback(() => {
		const newColumn: KanbanColumn = {
			id: `column-${Date.now()}`,
			title: "新しい列",
			cards: [],
		};
		setKanban((prevKanban) => {
			if (!prevKanban) return null;
			return {
				...prevKanban,
				columns: [...prevKanban.columns, newColumn],
			};
		});
	}, []);

	const handleDeleteColumn = useCallback((columnId: string) => {
		setKanban((prevKanban) => {
			if (!prevKanban) return null;
			return {
				...prevKanban,
				columns: prevKanban.columns.filter(
					(column) => column.id !== columnId
				),
			};
		});
	}, []);

	const handleUpdateColumnTitle = useCallback(
		(columnId: string, newTitle: string) => {
			setKanban((prevKanban) => {
				if (!prevKanban) return null;
				return {
					...prevKanban,
					columns: prevKanban.columns.map((column) =>
						column.id === columnId
							? { ...column, title: newTitle }
							: column
					),
				};
			});
		},
		[]
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

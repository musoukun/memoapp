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
<<<<<<< HEAD
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
=======
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
	const { id } = useParams();
	const [kanban, setKanban] = useState<Kanban | null>(initialKanban || null);
	const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);
>>>>>>> 32d9c58 (カンバン機能の立て直し、設計と実装をすべてやり直した。残りは永続化のみ)

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

<<<<<<< HEAD
	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!kanban) return <div>No kanban data available</div>;
=======
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

	const findColumn = useCallback(
		(id: string): KanbanColumn | undefined => {
			return kanban?.columns.find(
				(col) =>
					col.id === id || col.cards.some((card) => card.id === id)
			);
		},
		[kanban]
	);

	const handleDragOver = useCallback(
		(event: DragOverEvent) => {
			if (!kanban) return;

			const { active, over } = event;
			const activeId = active.id.toString();
			const overId = over ? over.id.toString() : null;

			const activeColumn = findColumn(activeId);
			const overColumn = overId ? findColumn(overId) : null;

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
>>>>>>> 32d9c58 (カンバン機能の立て直し、設計と実装をすべてやり直した。残りは永続化のみ)

	if (!kanban) {
		fetchKanban();
		return <div>Loading...</div>;
	}

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
<<<<<<< HEAD
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
=======
			<div className={`${height} flex p-4 dark:bg-gray-800 min-h-screen`}>
				<div className="flex-grow overflow-x-auto">
					<div className="flex gap-4">
						{kanban.columns.map((column) => (
							<Column
								key={column.id}
								column={column}
								onAddCard={handleAddCard}
								onDeleteCard={handleDeleteCard}
								onDeleteColumn={handleDeleteColumn}
								onUpdateTitle={handleUpdateColumnTitle}
								onSelectCard={setSelectedCard}
								onUpdateCard={handleUpdateCard}
							/>
						))}
						<button
							onClick={handleAddColumn}
							className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg h-min whitespace-nowrap"
						>
							+ 列を追加
						</button>
>>>>>>> 32d9c58 (カンバン機能の立て直し、設計と実装をすべてやり直した。残りは永続化のみ)
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
<<<<<<< HEAD
									updatedCard as Partial<KanbanCard>
=======
									updatedCard as unknown as KanbanCard
>>>>>>> 32d9c58 (カンバン機能の立て直し、設計と実装をすべてやり直した。残りは永続化のみ)
								);
							}
						}}
					/>
				)}
			</div>
		</DndContext>
	);
};

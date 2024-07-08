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
	DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useKanbanUpdate } from "../../hooks/useKanbanUpdate";
import { Column } from "./Column";
import { CardDetails } from "./CardDetails";
import { Kanban, KanbanCard, KanbanColumn } from "../../types/kanban";
import { useSetRecoilState } from "recoil";
import { kanbanState } from "../../atoms/kanbanAtom";
import kanbanApi from "../../api/kanbanApi";

export const KanbanBoard: React.FC = () => {
	const {
		kanban,
		addColumn,
		deleteColumn,
		addCard,
		deleteCard,
		moveCard,
		updateCard,
		updateKanbanTitle,
		updateColumnTitle,
	} = useKanbanUpdate();

	const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);
	const [editingTitle, setEditingTitle] = useState<string | null>(null);
	const setActiveCard = useState<KanbanCard | null>(null)[1];
	const setKanban = useSetRecoilState(kanbanState);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(KeyboardSensor)
	);

	const fetchKanban = async () => {
		try {
			const res = await kanbanApi.home();
			if (res.data) {
				setKanban(res.data);
			}
		} catch (error) {
			console.error("Failed to fetch kanban:", error);
		}
	};

	useEffect(() => {
		fetchKanban();
	}, []);

	const findColumnByCardId = useCallback(
		(cardId: string): KanbanColumn | undefined => {
			return kanban?.columns.find((column) =>
				column.cards.some((card) => card.id === cardId)
			);
		},
		[kanban]
	);

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const activeColumn = findColumnByCardId(active.id as string);
		if (activeColumn) {
			const activeCard = activeColumn.cards.find(
				(card) => card.id === active.id
			);
			setActiveCard(activeCard || null);
		}
	};

	const handleDragOver = useCallback(
		(event: DragOverEvent) => {
			const { active, over } = event;
			if (!over || !kanban) return;

			const activeColumn = findColumnByCardId(active.id as string);
			const overColumn =
				findColumnByCardId(over.id as string) ||
				kanban.columns.find((col) => col.id === over.id);

			if (!activeColumn || !overColumn || activeColumn === overColumn)
				return;

			const activeIndex = activeColumn.cards.findIndex(
				(card) => card.id === active.id
			);
			const overIndex = overColumn.cards.findIndex(
				(card) => card.id === over.id
			);

			const newIndex =
				over.id === overColumn.id ? overColumn.cards.length : overIndex;

			setKanban((prevKanban: Kanban) => {
				if (!prevKanban) return prevKanban;

				const newColumns = prevKanban.columns.map((column) => {
					if (column.id === activeColumn.id) {
						return {
							...column,
							cards: column.cards.filter(
								(card) => card.id !== active.id
							),
						};
					}
					if (column.id === overColumn.id) {
						const newCards = [...column.cards];
						newCards.splice(
							newIndex,
							0,
							activeColumn.cards[activeIndex]
						);
						return { ...column, cards: newCards };
					}
					return column;
				});

				return { ...prevKanban, columns: newColumns };
			});
		},
		[kanban, setKanban, findColumnByCardId]
	);

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event;
			setActiveCard(null);
			if (!over || !kanban) return;

			const activeColumn = findColumnByCardId(active.id as string);
			const overColumn =
				findColumnByCardId(over.id as string) ||
				kanban.columns.find((col) => col.id === over.id);

			if (!activeColumn || !overColumn) return;

			const activeIndex = activeColumn.cards.findIndex(
				(card) => card.id === active.id
			);
			const overIndex = overColumn.cards.findIndex(
				(card) => card.id === over.id
			);

			if (activeColumn !== overColumn) {
				const newIndex =
					over.id === overColumn.id
						? overColumn.cards.length
						: overIndex;
				moveCard(
					active.id as string,
					activeColumn.cards[activeIndex],
					activeColumn.id,
					overColumn.id,
					newIndex
				);
			} else if (activeIndex !== overIndex) {
				const newCards = arrayMove(
					activeColumn.cards,
					activeIndex,
					overIndex
				);
				console.log(newCards);
				updateColumnTitle(activeColumn.id, activeColumn.title);
			}
		},
		[kanban, moveCard, updateColumnTitle, findColumnByCardId]
	);

	const handleCardClick = (card: KanbanCard) => {
		setSelectedCard(card);
	};

	const handleCloseCardDetails = () => {
		setSelectedCard(null);
	};

	const handleUpdateCard = (cardId: string, data: Partial<KanbanCard>) => {
		updateCard(cardId, data);
	};

	const handleAddCard = (columnId: string) => {
		addCard(columnId, { title: "New Card" });
	};

	const handleDeleteCard = (columnId: string, cardId: string) => {
		deleteCard(columnId, cardId);
	};

	const handleAddColumn = () => {
		addColumn({ title: "New Column" });
	};

	const handleDeleteColumn = (columnId: string) => {
		deleteColumn(columnId);
	};

	const handleTitleEdit = (
		type: "kanban" | "column" | "card",
		id: string,
		newTitle: string
	) => {
		if (type === "kanban" && kanban) {
			updateKanbanTitle(newTitle);
		} else if (type === "column") {
			updateColumnTitle(id, newTitle);
		} else if (type === "card") {
			updateCard(id, { title: newTitle });
		}
		setEditingTitle(null);
	};

	if (!kanban) return <div className="dark:text-white">Loading...</div>;

	return (
		<div className="p-4 dark:bg-gray-800 min-h-screen">
			<h1
				className="text-2xl font-bold mb-4 cursor-pointer dark:text-white"
				onDoubleClick={() => setEditingTitle("kanban")}
			>
				{editingTitle === "kanban" ? (
					<input
						type="text"
						value={kanban.title}
						onChange={(e) =>
							handleTitleEdit("kanban", kanban.id, e.target.value)
						}
						onBlur={() => setEditingTitle(null)}
						autoFocus
						className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:text-white"
					/>
				) : (
					kanban.title
				)}
			</h1>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCorners}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
			>
				<div className="flex gap-4 overflow-x-auto">
					{kanban.columns.map((column) => (
						<Column
							key={column.id}
							column={column}
							onCardClick={handleCardClick}
							onAddCard={handleAddCard}
							onDeleteCard={handleDeleteCard}
							onDeleteColumn={handleDeleteColumn}
							onTitleEdit={(columnId, newTitle) =>
								handleTitleEdit("column", columnId, newTitle)
							}
							onCardTitleUpdate={(cardId, newTitle) =>
								handleTitleEdit("card", cardId, newTitle)
							}
						/>
					))}
					<button
						onClick={handleAddColumn}
						className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg h-min whitespace-nowrap"
					>
						+ Add Column
					</button>
				</div>
			</DndContext>
			{selectedCard && (
				<CardDetails
					card={selectedCard}
					onClose={handleCloseCardDetails}
					onUpdate={handleUpdateCard}
				/>
			)}
		</div>
	);
};

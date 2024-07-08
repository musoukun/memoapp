import React, { useState, useEffect } from "react";
import {
	DndContext,
	closestCorners,
	DragOverEvent,
	DragStartEvent,
} from "@dnd-kit/core";
import { useKanbanUpdate } from "../../hooks/useKanbanUpdate";
import { Column } from "./Column";
import { CardDetails } from "./CardDetails";
import { KanbanCard } from "../../types/kanban";
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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [activeId, setActiveId] = useState<string | null>(null);
	const setKanban = useSetRecoilState(kanbanState);

	const fetchKanban = async () => {
		try {
			await kanbanApi.home().then((res) => {
				setKanban(res.data);
			});
		} catch (error) {
			console.error("Failed to fetch kanban:", error);
		}
	};

	// 初期表示時にKanbanを取得
	useEffect(() => {
		fetchKanban();
	}, []);

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		setActiveId(active.id as string);
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over || !kanban) return;

		const activeId = active.id as string;
		const overId = over.id as string;

		if (activeId === overId) return;

		const activeColumn = kanban.columns.find((col) =>
			col.cards.some((card) => card.id === activeId)
		);
		const overColumn = kanban.columns.find(
			(col) =>
				col.id === overId ||
				col.cards.some((card) => card.id === overId)
		);

		if (!activeColumn || !overColumn) return;

		if (activeColumn !== overColumn) {
			const activeCardIndex = activeColumn.cards.findIndex(
				(card) => card.id === activeId
			);
			const overCardIndex = overColumn.cards.findIndex(
				(card) => card.id === overId
			);

			let newIndex: number;
			if (overId === overColumn.id) {
				newIndex = overColumn.cards.length;
			} else {
				newIndex =
					overCardIndex >= 0
						? overCardIndex
						: overColumn.cards.length;
			}

			moveCard(
				activeId,
				activeColumn.cards[activeCardIndex],
				activeColumn.id,
				overColumn.id,
				newIndex
			);
		} else {
			const oldIndex = activeColumn.cards.findIndex(
				(card) => card.id === activeId
			);
			const newIndex = activeColumn.cards.findIndex(
				(card) => card.id === overId
			);

			if (oldIndex !== newIndex) {
				moveCard(
					activeId,
					activeColumn.cards[oldIndex],
					activeColumn.id,
					activeColumn.id,
					newIndex
				);
			}
		}
	};

	const handleDragEnd = () => {
		setActiveId(null);
	};

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

	const handleCardTitleUpdate = (
		columnId: string,
		cardId: string,
		newTitle: string
	) => {
		updateCard(cardId, { title: newTitle });
	};

	if (!kanban) return <div>Loading...</div>;

	return (
		<div className="p-4">
			<h1
				className="text-2xl font-bold mb-4 cursor-pointer"
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
					/>
				) : (
					kanban.title
				)}
			</h1>
			<DndContext
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
				collisionDetection={closestCorners}
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
							onTitleEdit={(newTitle) =>
								handleTitleEdit("column", column.id, newTitle)
							}
							onCardTitleUpdate={handleCardTitleUpdate}
						/>
					))}
					<button
						onClick={handleAddColumn}
						className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg h-min whitespace-nowrap"
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

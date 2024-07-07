import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { CardDetails } from "./CardDetail";
import { Column as ColumnType, Card, Kanban } from "../../types/kanban";
import { Column } from "./Column";
import kanbanApi from "../../api/kanbanApi";
import { AxiosResponse } from "axios";

export function KanbanBoard() {
	const [kanban, setKanban] = useState<Kanban | null>(null);
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);

	useEffect(() => {
		fetchKanbanData();
	}, []);

	const fetchKanbanData = async () => {
		try {
			const response: AxiosResponse<Kanban | null> =
				await kanbanApi.home();
			if (response.data) {
				setKanban(response.data);
			}
		} catch (error) {
			console.error("Failed to fetch Kanban data", error);
		}
	};

	const updateKanban = async (updatedKanban: Kanban) => {
		setKanban(updatedKanban);
		try {
			await kanbanApi.update(updatedKanban.id, updatedKanban);
		} catch (error) {
			console.error("Failed to update Kanban data", error);
		}
	};

	const handleDoubleClick = (card: Card) => {
		setSelectedCard(card);
	};

	const handleClose = () => {
		setSelectedCard(null);
	};

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || !kanban) return;

		const activeCard = active.data.current as {
			card: Card;
			columnId: string;
		};
		const overColumnId = over.id as string;

		if (activeCard.columnId !== overColumnId) {
			setKanban((prevKanban) => {
				if (!prevKanban) return null;

				const updatedColumns = prevKanban.data.map((column) => {
					if (column.id === activeCard.columnId) {
						return {
							...column,
							cards: column.cards.filter(
								(card) => card.id !== activeCard.card.id
							),
						};
					}
					if (column.id === overColumnId) {
						return {
							...column,
							cards: [...column.cards, activeCard.card],
						};
					}
					return column;
				});

				const updatedKanban: Kanban = {
					...prevKanban,
					data: updatedColumns,
				};
				updateKanban(updatedKanban);
				return updatedKanban;
			});
		}
	};

	const handleInputChange = async (field: keyof Card, value: string) => {
		if (!kanban || !selectedCard) return;

		setSelectedCard((prev) => (prev ? { ...prev, [field]: value } : null));
		setKanban((prevKanban) => {
			if (!prevKanban) return null;

			const updatedColumns = prevKanban.data.map((column) => ({
				...column,
				cards: column.cards.map((card) =>
					card.id === selectedCard.id
						? { ...card, [field]: value }
						: card
				),
			}));

			const updatedKanban = { ...prevKanban, data: updatedColumns };
			updateKanban(updatedKanban);
			return updatedKanban;
		});
	};

	const handleAddCard = async (columnId: string) => {
		if (!kanban) return;

		const newCard: Card = {
			id: `card-${Date.now()}`,
			title: "新しいカード",
		};

		const updatedKanban: Kanban = {
			...kanban,
			data: kanban.data.map((column) => {
				if (column.id === columnId) {
					return {
						...column,
						cards: [...column.cards, newCard],
					};
				}
				return column;
			}),
		};

		updateKanban(updatedKanban);
	};

	const handleAddColumn = async () => {
		if (!kanban) return;

		const newColumn: ColumnType = {
			id: `column-${Date.now()}`,
			ColumnTitle: "新しい列",
			cards: [],
		};

		const updatedKanban: Kanban = {
			...kanban,
			data: [...kanban.data, newColumn],
		};

		updateKanban(updatedKanban);
	};

	if (!kanban) return <div>Loading...</div>;

	return (
		<div className="h-full my-5">
			<div className="my-4 text-xl font-bold text-[#c9d1d9]">
				{kanban.title}
			</div>
			<DndContext
				onDragEnd={handleDragEnd}
				collisionDetection={closestCorners}
			>
				<div className="flex gap-4">
					{kanban.data.map((column) => (
						<Column
							key={column.id}
							column={column}
							onCardDoubleClick={handleDoubleClick}
							onAddCard={handleAddCard}
							updateKanban={updateKanban}
							kanban={kanban}
						/>
					))}
					<button
						onClick={handleAddColumn}
						className="bg-[#161b22] text-[#c9d1d9] px-4 py-2 rounded-lg"
					>
						+ 新しい列
					</button>
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

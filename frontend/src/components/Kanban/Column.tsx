import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Card } from "./Card";
import { Card as CardType, Column as ColumnType } from "../../types/kanban";

interface ColumnProps {
	column: ColumnType;
	onCardDoubleClick: (card: CardType) => void;
	onCardDelete: (cardId: string, columnId: string) => void;
	onAddCard: (columnId: string) => void;
}

export function Column({
	column,
	onCardDoubleClick,
	onCardDelete,
	onAddCard,
}: ColumnProps) {
	const { setNodeRef } = useDroppable({
		id: column.id,
	});

	return (
		<div ref={setNodeRef} className="bg-[#161b22] rounded-xl w-[300px] p-4">
			<div className="flex justify-between items-center mb-2">
				<span className="text-[#c9d1d9]">{column.ColumnTitle}</span>
				<span className="text-[#8b949e]">{column.cards.length}</span>
			</div>
			{column.cards.map((card) => (
				<Card
					key={card.id}
					card={card}
					columnId={column.id}
					onDoubleClick={() => onCardDoubleClick(card)}
					onDeleteCard={onCardDelete}
				/>
			))}
			<button
				onClick={() => onAddCard(column.id)}
				className="text-[#8b949e]"
			>
				+ 新規
			</button>
		</div>
	);
}

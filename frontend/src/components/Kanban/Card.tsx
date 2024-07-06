import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Card as CardType } from "../../types/kanban";

interface CardProps {
	card: CardType;
	columnId: string;
	onDoubleClick: () => void;
	onDeleteCard: (cardId: string, columnId: string) => void;
}

export function Card({
	card,
	columnId,
	onDoubleClick,
	onDeleteCard,
}: CardProps) {
	const [showOptions, setShowOptions] = useState(false);
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: card.id,
		data: {
			card,
			columnId,
		},
	});

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			}
		: undefined;

	const handleMouseEnter = () => setShowOptions(true);
	const handleMouseLeave = () => setShowOptions(false);

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		onDeleteCard(card.id, columnId);
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onDoubleClick={onDoubleClick}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className="bg-[#0d1117] text-[#c9d1d9] p-2 mb-2 rounded-lg cursor-pointer relative"
		>
			{card.title}
			{showOptions && (
				<button
					onClick={handleDelete}
					className="absolute top-1 right-1 text-[#8b949e] hover:text-[#c9d1d9]"
				>
					⋮
				</button>
			)}
		</div>
	);
}

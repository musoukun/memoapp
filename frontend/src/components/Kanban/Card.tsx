import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KanbanCard } from "../../types/kanban";

interface CardProps {
	card: KanbanCard;
	onDelete: () => void;
}

export const Card: React.FC<CardProps> = ({ card, onDelete }) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id: card.id,
		});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className="bg-[#0d1117] text-[#c9d1d9] p-2 mb-2 rounded-lg cursor-pointer relative group"
		>
			<h3 className="text-lg text-[#c9d1d9]">{card.title}</h3>
			<button
				className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
				onClick={(e) => {
					e.stopPropagation();
					onDelete();
				}}
			>
				×
			</button>
		</div>
	);
};

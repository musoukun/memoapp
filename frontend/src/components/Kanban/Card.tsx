// Card.tsx
import { useDraggable } from "@dnd-kit/core";
import { Card as CardType } from "../../types/kanban";

interface CardProps {
	card: CardType;
	columnId: string;
	onDoubleClick: () => void;
}

export function Card({ card, columnId, onDoubleClick }: CardProps) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: card.id,
		data: {
			columnId,
		},
	});

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			}
		: undefined;

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onDoubleClick={onDoubleClick}
			className="bg-[#0d1117] text-[#c9d1d9] p-2 mb-2 rounded-lg cursor-pointer"
		>
			{card.title}
		</div>
	);
}

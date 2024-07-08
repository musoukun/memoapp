import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { KanbanCard } from "../../types/kanban";
import { BsThreeDots } from "react-icons/bs";

interface CardProps {
	card: KanbanCard;
	onClick: () => void;
	onDelete: () => void;
	onTitleUpdate: (cardId: string, newTitle: string) => void;
}

export const Card: React.FC<CardProps> = ({
	card,
	onClick,
	onDelete,
	onTitleUpdate,
}) => {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: card.id,
	});
	const [showMenu, setShowMenu] = useState(false);
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [editedTitle, setEditedTitle] = useState(card.title);

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			}
		: undefined;

	const handleTitleDoubleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsEditingTitle(true);
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditedTitle(e.target.value);
	};

	const handleTitleBlur = () => {
		setIsEditingTitle(false);
		if (editedTitle.trim() !== card.title) {
			onTitleUpdate(card.id, editedTitle.trim());
		}
	};

	const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleTitleBlur();
		}
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className="bg-white p-4 mb-2 rounded-lg shadow cursor-move relative group"
			onClick={onClick}
		>
			{isEditingTitle ? (
				<input
					type="text"
					value={editedTitle}
					onChange={handleTitleChange}
					onBlur={handleTitleBlur}
					onKeyDown={handleTitleKeyDown}
					className="w-full font-semibold"
					autoFocus
				/>
			) : (
				<h3
					className="font-semibold mb-2 cursor-pointer"
					onDoubleClick={handleTitleDoubleClick}
				>
					{card.title}
				</h3>
			)}
			<button
				className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
				onClick={(e) => {
					e.stopPropagation();
					setShowMenu(!showMenu);
				}}
			>
				<BsThreeDots size={16} />
			</button>
			{showMenu && (
				<div className="absolute top-8 right-2 bg-white shadow-lg rounded-lg p-2 z-10">
					<button
						className="text-red-500 hover:text-red-700"
						onClick={(e) => {
							e.stopPropagation();
							onDelete();
						}}
					>
						Delete
					</button>
				</div>
			)}
		</div>
	);
};

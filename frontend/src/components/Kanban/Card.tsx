import React, { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KanbanCard } from "../../types/kanban";
import { BsThreeDots } from "react-icons/bs";
import { Menu, MenuItem } from "@mui/material";

interface CardProps {
	card: KanbanCard;
	onDelete: () => void;
	onClick: () => void;
	onUpdate: (updatedCard: KanbanCard) => void;
}

export const Card: React.FC<CardProps> = ({
	card,
	onDelete,
	onClick,
	onUpdate,
}) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id: card.id,
		});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [editedTitle, setEditedTitle] = useState(card.title);
	const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
	const titleInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isEditingTitle && titleInputRef.current) {
			titleInputRef.current.focus();
		}
	}, [isEditingTitle]);

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditedTitle(e.target.value);
	};

	const handleTitleBlur = () => {
		setIsEditingTitle(false);
		if (editedTitle.trim() !== card.title) {
			onUpdate({ ...card, title: editedTitle.trim() });
		}
	};

	const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		setMenuAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setMenuAnchorEl(null);
	};

	const handleDeleteCard = (event: React.MouseEvent) => {
		event.stopPropagation(); // イベントの親要素への伝播を止める
		onDelete();
		handleMenuClose();
	};

	const handleCardClick = (event: React.MouseEvent) => {
		console.log(event.target);
		if (!isEditingTitle && !menuAnchorEl) {
			onClick();
		}
	};

	const handleDoubleClick = (event: React.MouseEvent) => {
		event.stopPropagation();
		setIsEditingTitle(true);
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onClick={handleCardClick}
			onDoubleClick={handleDoubleClick}
			className="bg-[#0d1117] text-[#c9d1d9] p-2 mb-2 rounded-lg cursor-pointer relative group"
		>
			{isEditingTitle ? (
				<input
					ref={titleInputRef}
					type="text"
					value={editedTitle}
					onChange={handleTitleChange}
					onBlur={handleTitleBlur}
					className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 text-[#c9d1d9]"
				/>
			) : (
				<h3 className="text-lg text-[#c9d1d9]">{card.title}</h3>
			)}
			<button
				className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
				onClick={handleMenuOpen}
			>
				<BsThreeDots size={16} />
			</button>
			<Menu
				anchorEl={menuAnchorEl}
				open={Boolean(menuAnchorEl)}
				onClose={handleMenuClose}
			>
				<MenuItem onClick={handleDeleteCard}>削除</MenuItem>
			</Menu>
		</div>
	);
};

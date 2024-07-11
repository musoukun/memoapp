import React, { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KanbanCard } from "../../types/kanban";
import { BsThreeDots, BsPencil } from "react-icons/bs";
import { Menu, MenuItem } from "@mui/material";

interface CardProps {
	card: KanbanCard;
	onDelete: () => void;
	onEdit: () => void;
	onUpdate: (updatedCard: KanbanCard) => void;
}

export const Card: React.FC<CardProps> = ({
	card,
	onDelete,
	onUpdate,
	onEdit,
}) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: card.id });
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [editedTitle, setEditedTitle] = useState(card.title);
	const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
	const titleInputRef = useRef<HTMLInputElement>(null);

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

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
		event.stopPropagation();
		onDelete();
		handleMenuClose();
	};

	const handleDoubleClick = (event: React.MouseEvent) => {
		event.stopPropagation();
		setIsEditingTitle(true);
	};

	const handleEditClick = (event: React.MouseEvent) => {
		event.stopPropagation();
		onEdit();
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onDoubleClick={handleDoubleClick}
			className="bg-white dark:bg-gray-700 p-2 mb-2 rounded-lg cursor-pointer relative group shadow-sm hover:shadow-md transition-shadow duration-200"
		>
			{isEditingTitle ? (
				<input
					ref={titleInputRef}
					type="text"
					value={editedTitle}
					onChange={handleTitleChange}
					onBlur={handleTitleBlur}
					className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 dark:text-white dark:border-gray-600"
				/>
			) : (
				<h3 className="text-lg text-gray-800 dark:text-gray-200">
					{card.title}
				</h3>
			)}
			<div className="absolute top-2 right-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
				<button
					className="text-gray-400 hover:text-gray-600 mr-2"
					onClick={handleEditClick}
				>
					<BsPencil size={16} />
				</button>
				<button
					className="text-gray-400 hover:text-gray-600"
					onClick={handleMenuOpen}
				>
					<BsThreeDots size={16} />
				</button>
			</div>
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

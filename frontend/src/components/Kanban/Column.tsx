import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanColumn } from "../../types/kanban";
import { Card } from "./Card";
import { BsThreeDots } from "react-icons/bs";
import { Menu, MenuItem } from "@mui/material";

interface ColumnProps {
	column: KanbanColumn;
	onAddCard: (columnId: string) => void;
	onDeleteCard: (columnId: string, cardId: string) => void;
	onDeleteColumn: (columnId: string) => void;
	onUpdateTitle: (columnId: string, newTitle: string) => void;
	onSelectCard: (card: KanbanColumn["cards"][0]) => void;
	onUpdateCard: (
		columnId: string,
		cardId: string,
		updatedCard: KanbanColumn["cards"][0]
	) => void;
}

export const Column: React.FC<ColumnProps> = ({
	column,
	onAddCard,
	onDeleteCard,
	onDeleteColumn,
	onUpdateTitle,
	onSelectCard,
	onUpdateCard,
}) => {
	const { setNodeRef } = useDroppable({ id: column.id });
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [editedTitle, setEditedTitle] = useState(column.title);
	const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditedTitle(e.target.value);
	};

	const handleTitleBlur = () => {
		setIsEditingTitle(false);
		if (editedTitle.trim() !== column.title) {
			onUpdateTitle(column.id, editedTitle.trim());
		}
	};

	const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
		setMenuAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setMenuAnchorEl(null);
	};

	const handleDeleteColumn = () => {
		onDeleteColumn(column.id);
		handleMenuClose();
	};

	return (
		<div ref={setNodeRef} className="bg-[#161b22] rounded-xl w-[300px] p-4">
			<div className="flex justify-between items-center mb-2">
				{isEditingTitle ? (
					<input
						type="text"
						value={editedTitle}
						onChange={handleTitleChange}
						onBlur={handleTitleBlur}
						className="font-bold text-lg bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 text-white"
						autoFocus
					/>
				) : (
					<h2
						className="font-bold text-lg cursor-pointer text-white"
						onDoubleClick={() => setIsEditingTitle(true)}
					>
						{column.title}
					</h2>
				)}
				<div className="flex items-center">
					<button
						onClick={handleMenuOpen}
						className="text-gray-500 hover:text-gray-700 mr-2"
					>
						<BsThreeDots size={16} />
					</button>
					<Menu
						anchorEl={menuAnchorEl}
						open={Boolean(menuAnchorEl)}
						onClose={handleMenuClose}
					>
						<MenuItem onClick={handleDeleteColumn}>削除</MenuItem>
					</Menu>
					<span className="text-gray-500">{column.cards.length}</span>
				</div>
			</div>
			<SortableContext
				items={column.cards.map((card) => card.id)}
				strategy={verticalListSortingStrategy}
			>
				<div className="flex-grow overflow-y-auto">
					{column.cards.map((card) => (
						<Card
							key={card.id}
							card={card}
							onDelete={() => onDeleteCard(column.id, card.id)}
							onClick={() => onSelectCard(card)}
							onUpdate={(updatedCard) =>
								onUpdateCard(column.id, card.id, updatedCard)
							}
						/>
					))}
				</div>
			</SortableContext>
			<button
				onClick={() => onAddCard(column.id)}
				className="text-[#8b949e] mt-2"
			>
				+ カードを追加
			</button>
		</div>
	);
};

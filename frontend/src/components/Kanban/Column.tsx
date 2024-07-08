import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { KanbanColumn, KanbanCard } from "../../types/kanban";
import { Card } from "./Card";
import { KanbanDropdownMenu } from "./KanbanDropdownMenu";
import { BsThreeDots } from "react-icons/bs";

interface ColumnProps {
	column: KanbanColumn;
	onCardClick: (card: KanbanCard) => void;
	onAddCard: (columnId: string) => void;
	onDeleteCard: (columnId: string, cardId: string) => void;
	onDeleteColumn: (columnId: string) => void;
	onTitleEdit: (columnId: string, newTitle: string) => void;
	onCardTitleUpdate: (
		columnId: string,
		cardId: string,
		newTitle: string
	) => void;
}

export const Column: React.FC<ColumnProps> = ({
	column,
	onCardClick,
	onAddCard,
	onDeleteCard,
	onDeleteColumn,
	onTitleEdit,
	onCardTitleUpdate,
}) => {
	const { setNodeRef } = useDroppable({ id: column.id });
	const [showDropdown, setShowDropdown] = useState(false);
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [editedTitle, setEditedTitle] = useState(column.title);

	const handleTitleDoubleClick = () => {
		setIsEditingTitle(true);
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditedTitle(e.target.value);
	};

	const handleTitleBlur = () => {
		setIsEditingTitle(false);
		if (editedTitle.trim() !== column.title) {
			onTitleEdit(column.id, editedTitle.trim());
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
			className="bg-gray-100 rounded-lg p-4 w-80 flex flex-col"
		>
			<div className="flex justify-between items-center mb-4">
				{isEditingTitle ? (
					<input
						type="text"
						value={editedTitle}
						onChange={handleTitleChange}
						onBlur={handleTitleBlur}
						onKeyDown={handleTitleKeyDown}
						className="font-bold text-lg"
						autoFocus
					/>
				) : (
					<h2
						className="font-bold text-lg cursor-pointer"
						onDoubleClick={handleTitleDoubleClick}
					>
						{column.title}
					</h2>
				)}
				<div className="flex items-center">
					<button
						onClick={() => setShowDropdown(!showDropdown)}
						className="text-gray-500 hover:text-gray-700 mr-2"
					>
						<BsThreeDots size={16} />
					</button>
					<span className="text-gray-500">{column.cards.length}</span>
				</div>
			</div>
			{showDropdown && (
				<KanbanDropdownMenu
					show={showDropdown}
					onClose={() => setShowDropdown(false)}
					onDelete={() => onDeleteColumn(column.id)}
				/>
			)}
			<div className="flex-grow overflow-y-auto">
				{column.cards.map((card) => (
					<Card
						key={card.id}
						card={card}
						onClick={() => onCardClick(card)}
						onDelete={() => onDeleteCard(column.id, card.id)}
						onTitleUpdate={(cardId, newTitle) =>
							onCardTitleUpdate(column.id, cardId, newTitle)
						}
					/>
				))}
			</div>
			<button
				onClick={() => onAddCard(column.id)}
				className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
			>
				+ Add Card
			</button>
		</div>
	);
};

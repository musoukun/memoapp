import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanColumn, KanbanCard } from "../../types/kanban";
import { Card } from "./Card";
import { BsThreeDots } from "react-icons/bs";

interface ColumnProps {
	column: KanbanColumn;
	onCardClick: (card: KanbanCard) => void;
	onAddCard: (columnId: string) => void;
	onDeleteCard: (columnId: string, cardId: string) => void;
	onDeleteColumn: (columnId: string) => void;
	onTitleEdit: (columnId: string, newTitle: string) => void;
	onCardTitleUpdate: (cardId: string, newTitle: string) => void; // 新しく追加
}

export const Column: React.FC<ColumnProps> = ({
	column,
	onCardClick,
	onAddCard,
	onDeleteCard,
	onDeleteColumn,
	onTitleEdit,
	onCardTitleUpdate, // 新しく追加
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
			onTitleEdit(column.id, editedTitle.trim()); // 修正
		}
	};

	const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleTitleBlur();
		}
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
						onKeyDown={handleTitleKeyDown}
						className="font-bold text-lg bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
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
					{/* column.cards が存在するかどうかをチェックし、存在しない場合はデフォルト値を使用する */}
					<span className="text-gray-500">
						{column.cards ? column.cards.length : 0}
					</span>
				</div>
			</div>
			{showDropdown && (
				<div className="absolute top-12 right-4 bg-white shadow-lg rounded-lg p-2 z-10">
					<button
						className="text-red-500 hover:text-red-700"
						onClick={() => onDeleteColumn(column.id)}
					>
						Delete Column
					</button>
				</div>
			)}
			<SortableContext
				items={column.cards ? column.cards.map((card) => card.id) : []}
				strategy={verticalListSortingStrategy}
			>
				<div className="flex-grow overflow-y-auto">
					{column.cards &&
						column.cards.map((card) => (
							<Card
								key={card.id}
								card={card}
								onClick={() => onCardClick(card)}
								onDelete={() =>
									onDeleteCard(column.id, card.id)
								}
								onTitleUpdate={(cardId, newTitle) =>
									onCardTitleUpdate(card.id, newTitle)
								} // 修正
							/>
						))}
				</div>
			</SortableContext>
			<button
				onClick={() => onAddCard(column.id)}
				className="text-[#8b949e]"
			>
				+ Add Card
			</button>
		</div>
	);
};

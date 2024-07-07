import React, { useState, useCallback } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Card } from "./Card";
import {
	Card as CardType,
	Column as ColumnType,
	Kanban,
} from "../../types/kanban";
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";

interface ColumnProps {
	column: ColumnType;
	onCardDoubleClick: (card: CardType) => void;
	onAddCard: (columnId: string) => void;
	updateKanban: (updatedKanban: Kanban) => void;
	kanban: Kanban;
}

export function Column({
	column,
	onCardDoubleClick,
	onAddCard,
	updateKanban,
	kanban,
}: ColumnProps) {
	const [showDropdown, setShowDropdown] = useState(false);
	const { setNodeRef } = useDroppable({
		id: column.id,
	});

	const handleDeleteColumn = useCallback(() => {
		const updatedKanban: Kanban = {
			...kanban,
			data: kanban.data.filter((col) => col.id !== column.id),
		};
		updateKanban(updatedKanban);
	}, [kanban, column.id, updateKanban]);

	const toggleDropdown = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		setShowDropdown((prev) => !prev);
	}, []);

	return (
		<div
			ref={setNodeRef}
			className="dark:bg-[#161b22] rounded-xl w-[300px] p-4 relative"
		>
			<div className="flex justify-between items-center mb-2">
				<span className="text-[#c9d1d9]">{column.ColumnTitle}</span>
				<div className="flex items-center">
					<div className="relative">
						<button
							onClick={toggleDropdown}
							className="text-[#8b949e] hover:text-[#c9d1d9] mr-2"
							aria-label="列メニューを開く"
						>
							<BsThreeDots size={16} />
						</button>
						{showDropdown && (
							<div className="absolute top-full right-0 mt-1 w-[150px] bg-[#161b22] border border-[#30363d] rounded shadow-lg z-20">
								<button
									onClick={handleDeleteColumn}
									className="w-full text-left px-4 py-2 hover:bg-[#21262d] flex items-center text-[#c9d1d9]"
								>
									<FaTrash className="mr-2" /> 削除
								</button>
							</div>
						)}
					</div>
					<span className="text-[#8b949e]">
						{column.cards.length}
					</span>
				</div>
			</div>
			{column.cards.map((card) => (
				<Card
					key={card.id}
					card={card}
					columnId={column.id}
					onDoubleClick={() => onCardDoubleClick(card)}
					updateKanban={updateKanban}
					kanban={kanban}
				/>
			))}
			<button
				onClick={() => onAddCard(column.id)}
				className="text-[#8b949e] hover:text-[#c9d1d9] w-full mt-2 p-2 bg-[#21262d] rounded"
			>
				+ 新規
			</button>
		</div>
	);
}

import React, { useState, useRef, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Card as CardType, Kanban } from "../../types/kanban";
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";

interface CardProps {
	card: CardType;
	columnId: string;
	onDoubleClick: () => void;
	updateKanban: (updatedKanban: Kanban) => void;
	kanban: Kanban;
}

export function Card({
	card,
	columnId,
	onDoubleClick,
	updateKanban,
	kanban,
}: CardProps) {
	const [showSideMenu, setShowSideMenu] = useState(false);
	const cardRef = useRef<HTMLDivElement>(null);
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

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		const updatedKanban: Kanban = {
			...kanban,
			data: kanban.data.map((column) => {
				if (column.id === columnId) {
					return {
						...column,
						cards: column.cards.filter((c) => c.id !== card.id),
					};
				}
				return column;
			}),
		};
		updateKanban(updatedKanban);
		setShowSideMenu(false);
	};

	const toggleSideMenu = (e: React.MouseEvent) => {
		e.stopPropagation();
		setShowSideMenu(!showSideMenu);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				cardRef.current &&
				!cardRef.current.contains(event.target as Node)
			) {
				setShowSideMenu(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div ref={cardRef} className="relative group">
			<div
				ref={setNodeRef}
				style={style}
				{...attributes}
				{...listeners}
				className="bg-[#0d1117] text-[#c9d1d9] p-2 mb-2 rounded-lg cursor-move relative"
				onDoubleClick={onDoubleClick}
			>
				<div className="pointer-events-none">{card.title}</div>
			</div>
			<button
				onClick={toggleSideMenu}
				className="absolute top-1 right-1 text-[#8b949e] hover:text-[#c9d1d9] opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-[#0d1117] p-1 rounded"
				aria-label="カードメニューを開く"
			>
				<BsThreeDots size={16} />
			</button>
			{showSideMenu && (
				<div className="absolute top-0 right-[-200px] w-[200px] bg-[#161b22] border border-[#30363d] rounded shadow-lg z-20">
					<button
						onClick={handleDelete}
						className="w-full text-left px-4 py-2 hover:bg-[#21262d] flex items-center text-[#c9d1d9]"
					>
						<FaTrash className="mr-2" /> 削除
					</button>
				</div>
			)}
		</div>
	);
}

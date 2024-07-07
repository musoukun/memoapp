// src/components/Kanban/DropdownMenu.tsx
import React, { useRef, useEffect } from "react";
import { FaTrash } from "react-icons/fa";

interface KanbanDropdownMenuProps {
	show: boolean;
	onClose: () => void;
	onDelete: () => void;
}

export const KanbanDropdownMenu: React.FC<KanbanDropdownMenuProps> = ({
	show,
	onClose,
	onDelete,
}) => {
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		if (show) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [show, onClose]);

	if (!show) return null;

	return (
		<div
			ref={dropdownRef}
			className="absolute top-8 right-0 bg-[#161b22] border border-[#30363d] rounded shadow-lg"
			style={{ minWidth: "100px", zIndex: 1000 }}
		>
			<button
				onClick={onDelete}
				className="w-full text-left px-4 py-2 hover:bg-[#21262d] flex items-center"
			>
				<FaTrash className="mr-2" /> 削除
			</button>
		</div>
	);
};
export default KanbanDropdownMenu;

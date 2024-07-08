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
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [show, onClose]);

	if (!show) return null;

	return (
		<div
			ref={dropdownRef}
			className="absolute top-8 right-0 bg-white border border-gray-200 rounded shadow-lg z-10"
		>
			<button
				onClick={onDelete}
				className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-600"
			>
				<FaTrash className="mr-2" /> Delete
			</button>
		</div>
	);
};

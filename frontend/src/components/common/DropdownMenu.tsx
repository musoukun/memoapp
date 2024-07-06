import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface DropdownMenuProps {
	noteId: string;
	position: { x: number; y: number };
	onClose: () => void;
	onDelete: (id: string) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
	noteId,
	position,
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

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [onClose]);

	return createPortal(
		<div
			ref={dropdownRef}
			className="fixed z-50 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5"
			style={{
				top: `${position.y}px`,
				left: `${position.x}px`,
			}}
		>
			<div
				className="py-1"
				role="menu"
				aria-orientation="vertical"
				aria-labelledby="options-menu"
			>
				<button
					onClick={() => onDelete(noteId)}
					className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
					role="menuitem"
				>
					<FontAwesomeIcon icon={faTrash} className="mr-2" />
					Delete
				</button>
				{/* 今後、他のメニュー項目をここに追加 */}
			</div>
		</div>,
		document.body
	);
};
export default DropdownMenu;

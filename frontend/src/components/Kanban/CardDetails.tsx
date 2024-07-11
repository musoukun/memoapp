import { useState, useEffect } from "react";
import { KanbanCard } from "../../types/kanban";

interface CardDetailsProps {
	card: KanbanCard;
	onClose: () => void;
	onUpdate: (updatedCard: KanbanCard) => void; // この型を変更
}

export const CardDetails: React.FC<CardDetailsProps> = ({
	card,
	onClose,
	onUpdate,
}) => {
	const [editedCard, setEditedCard] = useState<KanbanCard>(card);

	useEffect(() => {
		setEditedCard(card);
	}, [card]);

	const handleInputChange = (field: keyof KanbanCard, value: string) => {
		setEditedCard((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onUpdate(editedCard); // カード全体を渡す
		onClose();
	};

	return (
		<div className="fixed top-0 right-0 w-[400px] h-full bg-[#161b22] p-4 overflow-y-auto">
			<h2 className="text-xl font-bold mb-4 dark:text-white">
				Edit Card
			</h2>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label className="block text-sm font-medium dark:text-white text-gray-700">
						Title
					</label>
					<input
						type="text"
						value={editedCard.title}
						onChange={(e) =>
							handleInputChange("title", e.target.value)
						}
						className="text-xl  rounded-md text-[#c9d1d9] dark:text-white dark:bg-gray-700"
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 dark:text-white">
						Description
					</label>
					<textarea
						value={editedCard.description || ""}
						onChange={(e) =>
							handleInputChange("description", e.target.value)
						}
						className="mt-1 block w-full rounded-md dark:text-white dark:bg-gray-700 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
						rows={3}
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 dark:text-white">
						Status
					</label>
					<select
						value={editedCard.status || ""}
						onChange={(e) =>
							handleInputChange("status", e.target.value)
						}
						className="mt-1 block w-full rounded-md dark:bg-gray-700 dark:text-white border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					>
						<option value="">Select status</option>
						<option value="To Do">To Do</option>
						<option value="In Progress">In Progress</option>
						<option value="Done">Done</option>
					</select>
				</div>
				<div className="flex justify-end">
					<button
						type="button"
						onClick={onClose}
						className="mr-2 px-4 py-2 border  border-gray-300 rounded-md text-sm font-medium dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Cancel
					</button>
					<button
						type="submit"
						className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Save
					</button>
				</div>
			</form>
		</div>
	);
};

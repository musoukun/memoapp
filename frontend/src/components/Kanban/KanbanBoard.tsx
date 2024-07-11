import {
	useSensors,
	useSensor,
	PointerSensor,
	KeyboardSensor,
	DndContext,
	closestCorners,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import kanbanApi from "../../api/kanbanApi";
import { useKanbanDnD } from "../../hooks/useKanbanDnD";
import { useKanbanState } from "../../hooks/useKanbanState";
import { Kanban, KanbanCard, KanbanColumn } from "../../types/kanban";
import { createNewCard, createNewColumn } from "../../utils/KanbanUtils";
import { CardDetails } from "./CardDetails";
import { Column } from "./Column";
import { useSetRecoilState } from "recoil";
import { userKanbansAtom } from "../../atoms/kanbanAtom";
import EmojiPicker from "../common/EmojiPicker";

interface KanbanBoardProps {
	initialKanban?: Kanban;
	height: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
	initialKanban,
	height,
}) => {
	const { id } = useParams<{ id: string }>();
	const setKanbans = useSetRecoilState(userKanbansAtom);
	const { kanban, setKanban, updateKanban, updateColumn, updateCard, error } =
		useKanbanState(initialKanban || null, id!);
	const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [editedTitle, setEditedTitle] = useState(kanban?.title || "");

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const { handleDragOver, handleDragEnd } = useKanbanDnD(
		kanban,
		updateKanban
	);

	const fetchKanban = useCallback(async () => {
		if (id) {
			try {
				const response = await kanbanApi.getKanban(id);
				setKanban(response.data);
			} catch (err) {
				console.log("Failed to fetch Kanban:", err);
			}
		}
	}, [id, setKanban]);

	const fetchKanbans = useCallback(async () => {
		if (id) {
			try {
				const response = await kanbanApi.getKanbans();
				setKanbans(response.data);
			} catch (err) {
				console.log("Failed to fetch Kanban:", err);
			}
		}
	}, [id, setKanban]);

	useEffect(() => {
		if (!initialKanban) {
			fetchKanban();
			fetchKanbans();
		}
	}, [fetchKanban, initialKanban]);

	const handleAddCard = useCallback(
		(columnId: string) => {
			updateColumn(columnId, (column) => ({
				...column,
				cards: [createNewCard(), ...column.cards],
			}));
		},
		[updateColumn]
	);

	const handleDeleteCard = useCallback(
		(columnId: string, cardId: string) => {
			updateColumn(columnId, (column) => ({
				...column,
				cards: column.cards.filter((card) => card.id !== cardId),
			}));
			if (selectedCard && selectedCard.id === cardId) {
				setSelectedCard(null);
			}
		},
		[updateColumn, selectedCard]
	);

	const handleUpdateCard = useCallback(
		(columnId: string, cardId: string, updatedCard: KanbanCard) => {
			updateCard(columnId, cardId, () => updatedCard);
			if (selectedCard && selectedCard.id === cardId) {
				setSelectedCard(updatedCard);
			}
		},
		[updateCard, selectedCard]
	);

	const handleAddColumn = useCallback(() => {
		updateKanban((prevKanban) => ({
			...prevKanban,
			columns: [...prevKanban.columns, createNewColumn()],
		}));
	}, [updateKanban]);

	const handleDeleteColumn = useCallback(
		(columnId: string) => {
			updateKanban((prevKanban) => ({
				...prevKanban,
				columns: prevKanban.columns.filter(
					(column) => column.id !== columnId
				),
			}));
		},
		[updateKanban]
	);

	const handleUpdateColumnTitle = useCallback(
		(columnId: string, newTitle: string) => {
			updateColumn(columnId, (column) => ({
				...column,
				title: newTitle,
			}));
		},
		[updateColumn]
	);

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditedTitle(e.target.value);
	};

	const handleTitleBlur = () => {
		setIsEditingTitle(false);
		if (editedTitle.trim() !== kanban?.title) {
			updateKanban((prevKanban) => ({
				...prevKanban,
				title: editedTitle.trim(),
			}));
			// Update the kanbans state in Recoil
			setKanbans((prevKanbans) =>
				prevKanbans.map((k) =>
					k.id === kanban?.id
						? { ...k, title: editedTitle.trim() }
						: k
				)
			);
		}
	};

	const handleIconChange = useCallback(
		(newIcon: string) => {
			updateKanban((prevKanban) => ({
				...prevKanban,
				icon: newIcon,
			}));
			// Recoilの状態も更新
			setKanbans((prevKanbans) =>
				prevKanbans.map((k) =>
					k.id === kanban?.id ? { ...k, icon: newIcon } : k
				)
			);
		},
		[updateKanban, setKanbans, kanban]
	);

	if (!kanban) {
		return <div>Loading...</div>;
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
		>
			<div
				className={`${height} flex flex-col p-4 bg-gray-100 dark:bg-gray-900 min-h-screen rounded-xl`}
			>
				{error && <div className="text-red-500">{error}</div>}
				<div className="mb-4">
					<div className="p-1 h-8 mb-2">
						<EmojiPicker
							icon={kanban.icon || "📜"}
							size={24}
							//default値を設定する方法→
							onChange={handleIconChange}
						/>
					</div>
					{isEditingTitle ? (
						<input
							type="text"
							value={editedTitle}
							onChange={handleTitleChange}
							onBlur={handleTitleBlur}
							className="text-2xl font-bold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 dark:text-white"
							autoFocus
						/>
					) : (
						<h1
							className="text-2xl font-bold cursor-pointer dark:text-white"
							onDoubleClick={() => setIsEditingTitle(true)}
						>
							{kanban.title}
						</h1>
					)}
				</div>
				<div className="flex-grow overflow-x-auto">
					<div className="flex gap-4">
						{kanban.columns.map((column: KanbanColumn) => (
							<Column
								key={column.id}
								column={column}
								onAddCard={handleAddCard}
								onDeleteCard={handleDeleteCard}
								onDeleteColumn={handleDeleteColumn}
								onUpdateTitle={handleUpdateColumnTitle}
								onEditCard={setSelectedCard}
								onUpdateCard={handleUpdateCard}
							/>
						))}
						<button
							onClick={handleAddColumn}
							className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg h-min whitespace-nowrap"
						>
							+ 列を追加
						</button>
					</div>
				</div>
				{selectedCard && (
					<CardDetails
						card={selectedCard}
						onClose={() => setSelectedCard(null)}
						onUpdate={(updatedCard) => {
							console.log(
								"Updated card before processing:",
								updatedCard
							);
							const column = kanban.columns.find((col) =>
								col.cards.some((c) => c.id === selectedCard.id)
							);
							if (column) {
								handleUpdateCard(
									column.id,
									selectedCard.id,
									updatedCard
								);
							}
							console.log(
								"Updated card after processing:",
								updatedCard
							);
						}}
					/>
				)}
			</div>
		</DndContext>
	);
};

import { useCallback } from "react";
import { Kanban, KanbanColumn, KanbanCard } from "../types/kanban";
import kanbanApi from "../api/kanbanApi";
import { useRecoilCallback, useRecoilState } from "recoil";
import { kanbanState } from "../atoms/kanbanAtom";

export const useKanbanUpdate = () => {
	const [kanban, setKanban] = useRecoilState<Kanban>(kanbanState);

	const updateCard = useCallback(
		async (cardId: string, data: Partial<KanbanCard>) => {
			if (!kanban) return;

			// 即時のUI更新
			setKanban((prevKanban: any) => {
				if (!prevKanban) return null;
				const updatedColumns = prevKanban.columns.map(
					(column: KanbanColumn) => ({
						...column,
						cards: column.cards.map((card: KanbanCard) =>
							card.id === cardId ? { ...card, ...data } : card
						),
					})
				);
				return { ...prevKanban, columns: updatedColumns };
			});

			// バックエンドの更新
			try {
				const updatedCard = await kanbanApi.updateCard(
					kanban.id,
					data.columnId || "",
					cardId,
					data
				);
				// バックエンドの応答を反映
				setKanban((prevKanban: any) => {
					if (!prevKanban) return null;
					const updatedColumns = prevKanban.columns.map(
						(column: KanbanColumn) => ({
							...column,
							cards: column.cards.map((card: KanbanCard) =>
								card.id === cardId ? updatedCard : card
							),
						})
					);
					return { ...prevKanban, columns: updatedColumns };
				});
			} catch (error) {
				console.error("Failed to update card:", error);
				// エラー時は元の状態に戻す処理を追加
			}
		},
		[kanban, setKanban]
	);

	const addColumn = useCallback(
		async (columnData: Partial<KanbanColumn>) => {
			if (!kanban) return;

			const tempId = `temp-${Date.now()}`;
			const newColumn: KanbanColumn = {
				id: tempId,
				title: columnData.title || "New Column",
				cards: [],
				...columnData,
			};

			// // 即時のUI更新
			// setKanban((prevKanban: any) => {
			// 	if (!prevKanban) return null;
			// 	return {
			// 		...prevKanban,
			// 		columns: [...prevKanban.columns, newColumn],
			// 	};
			// });

			try {
				await kanbanApi.addColumn(kanban.id, newColumn).then((res) => {
					setKanban((prevKanban: any) => {
						if (!prevKanban) return null;
						return {
							...prevKanban,
							columns: [...prevKanban.columns, res.data],
						};
					});
				});
			} catch (error) {
				console.error("Failed to add column:", error);
				// エラー時は追加した列を削除
				setKanban((prevKanban: any) => {
					if (!prevKanban) return null;
					return {
						...prevKanban,
						columns: prevKanban.columns.filter(
							(col: KanbanColumn) => col.id !== tempId
						),
					};
				});
			}
		},
		[kanban, setKanban]
	);

	const deleteColumn = useCallback(
		async (columnId: string) => {
			if (!kanban) return;

			const originalKanban = { ...kanban };
			// 即時のUI更新
			setKanban((prevKanban: any) => {
				if (!prevKanban) return null;
				return {
					...prevKanban,
					columns: prevKanban.columns.filter(
						(column: KanbanColumn) => column.id !== columnId
					),
				};
			});

			try {
				await kanbanApi.deleteColumn(kanban.id, columnId);
			} catch (error) {
				console.error("Failed to delete column:", error);
				// エラー時は元の状態に戻す
				setKanban(originalKanban);
			}
		},
		[kanban, setKanban]
	);

	const addCard = useRecoilCallback(
		({ set }) =>
			async (columnId: string, cardData: Partial<KanbanCard>) => {
				if (!kanban) return;

				const tempId = `temp-${Date.now()}`;
				const newCard: KanbanCard = {
					id: tempId,
					title: cardData.title || "New Card",
					...cardData,
				};

				// 即時のUI更新
				set(kanbanState, (prevKanban: any) => {
					if (!prevKanban) return null;
					return {
						...prevKanban,
						columns: prevKanban.columns.map(
							(column: KanbanColumn) =>
								column.id === columnId
									? {
											...column,
											cards: [...column.cards, newCard],
										}
									: column
						),
					};
				});

				try {
					const response = await kanbanApi.addCard(
						kanban.id,
						columnId,
						newCard
					);
					// バックエンドの応答を反映
					set(kanbanState, (prevKanban: any) => {
						if (!prevKanban) return null;
						return {
							...prevKanban,
							columns: prevKanban.columns.map(
								(column: KanbanColumn) =>
									column.id === columnId
										? {
												...column,
												cards: column.cards.map(
													(card: KanbanCard) =>
														card.id === tempId
															? response.data
															: card
												),
											}
										: column
							),
						};
					});
				} catch (error) {
					console.error("Failed to add card:", error);
					// エラー時はカードを削除
					set(kanbanState, (prevKanban: any) => {
						if (!prevKanban) return null;
						return {
							...prevKanban,
							columns: prevKanban.columns.map(
								(column: KanbanColumn) =>
									column.id === columnId
										? {
												...column,
												cards: column.cards.filter(
													(card: KanbanCard) =>
														card.id !== tempId
												),
											}
										: column
							),
						};
					});
				}
			},
		[kanban]
	);

	const deleteCard = useCallback(
		async (columnId: string, cardId: string) => {
			if (!kanban) return;

			const originalKanban = { ...kanban };
			// 即時のUI更新
			setKanban((prevKanban: any) => {
				if (!prevKanban) return null;
				return {
					...prevKanban,
					columns: prevKanban.columns.map((column: KanbanColumn) =>
						column.id === columnId
							? {
									...column,
									cards: column.cards.filter(
										(card: KanbanCard) => card.id !== cardId
									),
								}
							: column
					),
				};
			});

			try {
				await kanbanApi.deleteCard(kanban.id, columnId, cardId);
			} catch (error) {
				console.error("Failed to delete card:", error);
				// エラー時は元の状態に戻す
				setKanban(originalKanban);
			}
		},
		[kanban, setKanban]
	);

	const moveCard = useCallback(
		async (
			cardId: string,
			activeCard: KanbanCard,
			fromColumnId: string,
			toColumnId: string,
			newIndex: number
		) => {
			if (!kanban) return;

			const originalKanban = { ...kanban };
			// 即時のUI更新
			setKanban((prevKanban: any) => {
				if (!prevKanban) return null;
				const updatedColumns = prevKanban.columns.map(
					(column: KanbanColumn) => {
						if (column.id === fromColumnId) {
							return {
								...column,
								cards: column.cards.filter(
									(card: KanbanCard) => card.id !== cardId
								),
							};
						}
						if (column.id === toColumnId) {
							const updatedCards = [...column.cards];
							updatedCards.splice(newIndex, 0, activeCard);
							return { ...column, cards: updatedCards };
						}
						return column;
					}
				);
				return { ...prevKanban, columns: updatedColumns };
			});

			try {
				await kanbanApi.moveCard(
					kanban.id,
					fromColumnId,
					toColumnId,
					cardId,
					newIndex
				);
			} catch (error) {
				console.error("Failed to move card:", error);
				// エラー時は元の状態に戻す
				setKanban(originalKanban);
			}
		},
		[kanban, setKanban]
	);

	const updateKanbanTitle = useCallback(
		async (newTitle: string) => {
			if (!kanban) return;

			const originalKanban = { ...kanban };
			// 即時のUI更新
			setKanban((prevKanban: any) => {
				if (!prevKanban) return null;
				return { ...prevKanban, title: newTitle };
			});

			try {
				await kanbanApi.update(kanban.id, { title: newTitle });
			} catch (error) {
				console.error("Failed to update Kanban title:", error);
				// エラー時は元の状態に戻す
				setKanban(originalKanban);
			}
		},
		[kanban, setKanban]
	);

	const updateColumnTitle = useCallback(
		async (columnId: string, newTitle: string) => {
			if (!kanban) return;

			const originalKanban = { ...kanban };
			// 即時のUI更新
			setKanban((prevKanban: any) => {
				if (!prevKanban) return null;
				return {
					...prevKanban,
					columns: prevKanban.columns.map((column: KanbanColumn) =>
						column.id === columnId
							? { ...column, title: newTitle }
							: column
					),
				};
			});

			try {
				await kanbanApi.updateColumn(kanban.id, columnId, {
					title: newTitle,
				});
			} catch (error) {
				console.error("Failed to update column title:", error);
				// エラー時は元の状態に戻す
				setKanban(originalKanban);
			}
		},
		[kanban, setKanban]
	);

	return {
		kanban,
		addColumn,
		deleteColumn,
		addCard,
		deleteCard,
		moveCard,
		updateCard,
		updateKanbanTitle,
		updateColumnTitle,
	};
};

import { useState, useCallback } from "react";
import { Kanban, KanbanCard, KanbanColumn } from "../types/kanban";
import {
	updateColumn,
	updateCard,
	findColumnByCardId,
} from "../utils/KanbanUtils";
import { arrayMove } from "@dnd-kit/sortable";

export const useKanban = (initialData: Kanban) => {
	const [kanban, setKanban] = useState<Kanban>(initialData);
	const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);

	const updateKanban = useCallback((updater: (prev: Kanban) => Kanban) => {
		setKanban((prev) => updater(prev));
	}, []);

	// スプレッド構文：右辺のオブジェクトのプロパティを左辺のオブジェクトに展開する
	const cardOperations = {
		add: useCallback(
			(columnId: string) => {
				const newCard: KanbanCard = {
					id: `card-${Date.now()}`,
					title: "新しいカード",
					description: "",
					status: "",
				};

				updateKanban(
					(
						prev // prevは前回のkanbanの状態
					) =>
						updateColumn(prev, columnId, (column) => ({
							// updateColumn関数でカラムを更新
							...column, // カラム全体をコピー
							cards: [newCard, ...column.cards],
						}))
				);
			},
			[updateKanban]
		),

		delete: useCallback(
			(columnId: string, cardId: string) => {
				updateKanban(
					(
						prev // prevは前回のkanbanの状態
					) =>
						updateColumn(prev, columnId, (column) => ({
							...column, // カラム全体をコピー
							cards: column.cards.filter(
								// カードをフィルタリング
								(card) => card.id !== cardId // 削除対象のカードID以外を残す
							),
						}))
				);
				setSelectedCard((prev) => (prev?.id === cardId ? null : prev)); // 選択中のカードが削除された場合はnullにする
			},
			[updateKanban]
		),

		// カードを更新する関数
		update: useCallback(
			(
				columnId: string,
				cardId: string,
				updatedCard: Partial<KanbanCard>
			) => {
				updateKanban((prev) =>
					// updateColumn関数でカラムを更新
					updateColumn(prev, columnId, (column) =>
						// updateCard関数でカードを更新
						updateCard(column, cardId, (card) => ({
							...card, // カード全体をコピー
							...updatedCard, // 更新情報をマージ
							id: cardId, // カードIDが一致する場合は更新情報で上書き
						}))
					)
				);
			},
			[updateKanban]
		),
	};

	const columnOperations = {
		add: useCallback(() => {
			// カラムの追加処理
			const newColumn: KanbanColumn = {
				// 新しいカラムオブジェクトの作成
				id: `column-${Date.now()}`, // ユニークなIDを生成
				title: "新しい列", // 初期タイトル
				cards: [], // 空のカードリスト
			};
			updateKanban((prev) => ({
				// 現在の状態を受け取り、新しい状態を返す関数
				...prev, // 現在のカンバンの状態を保持
				columns: [...prev.columns, newColumn], // 新しいカラムを追加
			}));
		}, [updateKanban]), // 依存配列

		delete: useCallback(
			(columnId: string) => {
				// カラムの削除処理。削除するカラムのIDを引数に取る
				updateKanban((prev) => ({
					// 現在の状態を受け取り、新しい状態を返す関数
					...prev, // 現在のカンバンの状態を保持
					columns: prev.columns.filter(
						(column) => column.id !== columnId // IDが一致しないカラムのみを残すことで削除を実現
					),
				}));
			},
			[updateKanban] // 依存配列
		),

		updateTitle: useCallback(
			(columnId: string, newTitle: string) => {
				updateKanban((prev) =>
					updateColumn(prev, columnId, (column) => ({
						...column,
						title: newTitle,
					}))
				);
			},
			[updateKanban]
		),
	};

	const dragOperations = {
		end: useCallback(
			(activeId: string, overId: string) => {
				updateKanban((prev) => {
					// activeColumn: ドラッグ元のカードが所属するカラム
					const activeColumn = findColumnByCardId(prev, activeId);
					// overColumn: ドラッグ先のカードが所属するカラム
					const overColumn = findColumnByCardId(prev, overId);

					// activeColumnまたはoverColumnが存在しない場合
					// またはactiveColumnとoverColumnが同じ場合は何もしない
					if (
						!activeColumn ||
						!overColumn ||
						activeColumn !== overColumn
					) {
						return prev;
					}

					// activeColumnのカードリストからactiveIdのカードのインデックスを取得
					const activeIndex = activeColumn.cards.findIndex(
						(card) => card.id === activeId
					);
					// overColumnのカードリストからoverIdのカードのインデックスを取得
					const overIndex = overColumn.cards.findIndex(
						(card) => card.id === overId
					);

					// カードの移動処理
					// activeColumnのカードリストからactiveIndexの位置のカードを削除し、
					// overColumnのカードリストのoverIndexの位置に挿入する
					return updateColumn(prev, activeColumn.id, (column) => ({
						...column,
						cards: arrayMove(column.cards, activeIndex, overIndex),
					}));
				});
			},
			[updateKanban]
		),

		over: useCallback(
			(activeId: string, overId: string) => {
				updateKanban((prev) => {
					// activeColumn: ドラッグ元のカードが所属するカラム
					const activeColumn = findColumnByCardId(prev, activeId);
					// overColumn: ドラッグ先のカードが所属するカラム
					const overColumn = findColumnByCardId(prev, overId);

					// activeColumnまたはoverColumnが存在しない場合
					// またはactiveColumnとoverColumnが同じ場合は何もしない
					if (
						!activeColumn ||
						!overColumn ||
						activeColumn === overColumn
					) {
						return prev;
					}

					// activeColumnのカードリストからactiveIdのカードを削除し、
					// overColumnのカードリストの先頭に挿入する
					const updatedPrev = updateColumn(
						prev,
						activeColumn.id,
						(column) => ({
							...column,
							cards: column.cards.filter(
								(card) => card.id !== activeId
							),
						})
					);

					// overColumnのカードリストの末尾にactiveIdのカードを追加する
					return updateColumn(
						updatedPrev,
						overColumn.id,
						(column) => ({
							...column,
							cards: [
								...column.cards,
								activeColumn.cards.find(
									(card) => card.id === activeId
								)!,
							],
						})
					);
				});
			},
			[updateKanban]
		),
	};

	return {
		kanban,
		selectedCard,
		setSelectedCard,
		handleAddCard: cardOperations.add,
		handleDeleteCard: cardOperations.delete,
		handleUpdateCard: cardOperations.update,
		handleAddColumn: columnOperations.add,
		handleDeleteColumn: columnOperations.delete,
		handleUpdateColumnTitle: columnOperations.updateTitle,
		handleDragEnd: dragOperations.end,
		handleDragOver: dragOperations.over,
	};
};

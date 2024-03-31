/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { v4 as uuidv4 } from "uuid";
import React, { useState, useCallback, useEffect, useRef } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	verticalListSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ReactMarkdown from "react-markdown";
import { Box } from "@mui/material";

type MemoLine = {
	id: string;
	text: string;
	isFocus: boolean;
};

export const MarkdownLineEditor = () => {
	// テキストエリアのリストを管理するための状態
	const [memoLines, setMemoLines] = useState<MemoLine[]>([
		{ id: "top", text: "", isFocus: true },
	]);

	// フォーカスを変更したいmemoLineのIDを一時保存するための状態
	const [focusedMemoLineId, setFocusedMemoLineId] = useState<string | null>(
		null
	);

	// 各memoLineの全体に対する参照を保持する配列
	const memoLineRefs = useRef<(HTMLDivElement | null)[]>([]);

	const setValue = (id: string, newText: any) => {
		// テキストエリアの値を更新する関数

		setMemoLines(
			(
				memoLines // memoLinesのコピーを作成
			) =>
				memoLines.map(
					(
						memoLine // memoLinesの各要素に対して以下の処理を行う
					) =>
						memoLine.id === id
							? { ...memoLine, text: newText }
							: memoLine // idが一致する要素のtextを更新
				)
		);
	};

	// ドラッグアンドドロップが終了したときの処理
	const handleDragEnd = (event: { active: any; over: any }) => {
		const { active, over } = event; // active: ドラッグ中のアイテム, over: ドロップ先のアイテム
		if (active.id !== over.id) {
			// ドラッグ中のアイテムとドロップ先のアイテムが異なる場合
			setMemoLines((memoLines) => {
				// memoLinesの状態を更新
				const oldIndex = memoLines.findIndex(
					// 		ドラッグ中のアイテムのインデックスを取得
					(memoLine) => memoLine.id === active.id // ドラッグ中のアイテムのidと一致する要素のインデックスを取得
				);
				const newIndex = memoLines.findIndex(
					(memoLine) => memoLine.id === over.id
				); // ドロップ先のアイテムのインデックスを取得
				return arrayMove(memoLines, oldIndex, newIndex); // ドラッグ中のアイテムをドロップ先のアイテムの位置に移動
			});
		}
	};

	// attributes: ドラッグアンドドロップのための属性
	// listeners: ドラッグアンドドロップのためのリスナー
	// setNodeRef: ドラッグアンドドロップのためのref(参照先の要素を設定するための関数)
	// transform: ドラッグアンドドロップのためのtransform(要素の位置を変更するための関数)
	const { attributes, transform, transition } = useSortable({ id: "1" });

	// ドラッグアンドドロップのためのセンサーを設定
	const sensors = useSensors(
		useSensor(PointerSensor), // マウスセンサー
		useSensor(KeyboardSensor) // キーボードセンサー
	);

	// ドラッグアンドドロップのためのスタイル
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	// useEffectを使用して、フォーカスを管理します
	useEffect(() => {
		const changeFocus = async () => {
			// 2回目以降のフォーカス変更の処理のみconsole.logを表示
			console.log("変更前:", memoLines);
			// フォーカスを変更する
			if (focusedMemoLineId) {
				//clickedMemoLine.id が一致しないメモラインのisFocusをfalseにする
				setMemoLines((currentMemoLines) =>
					currentMemoLines.map((memoLine) => ({
						...memoLine,
						isFocus: false,
					}))
				);

				//clickedMemoLine.id が一致するメモラインのisFocusをtrueにする
				setFocus(focusedMemoLineId);
				const index = memoLines.findIndex(
					(line) => line.id === focusedMemoLineId
				);
				if (index !== -1) {
					memoLineRefs.current[index]?.focus();
					setFocusedMemoLineId(null); // フォーカスを更新したらIDをクリア
				}
			}
			// ここまでの処理が終わるまで待機
			await new Promise((resolve) => setTimeout(resolve, 0));
			console.log("変更後:", memoLines);
		};

		changeFocus();
	}, [focusedMemoLineId]);

	// テキストエリアのKeyDownイベントを処理する関数
	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLTextAreaElement>,
		memoLine: MemoLine,
		index: number
	) => {
		if (e.key === "Enter") {
			e.preventDefault(); // デフォルトの挙動を阻止
			addMemoLine(index + 1); // 現在のindexの次に新しいメモラインを追加
			console.log(memoLines);
		}
	};

	// memo を追加する関数
	const addMemoLine = useCallback((index: number) => {
		// currentMemoLinesのisFocusを全てfalseにする
		setMemoLines((currentMemoLines) =>
			currentMemoLines.map((memoLine) => ({
				...memoLine,
				isFocus: false,
			}))
		);

		setMemoLines((currentMemoLines) => {
			const newLines = [
				...currentMemoLines.slice(0, index),
				{ id: uuidv4(), text: "", isFocus: true },
				...currentMemoLines.slice(index),
			];
			// isFocusがtrueのメモラインのIDを設定
			setFocusedMemoLineId(newLines[index].id);
			return newLines;
		});
	}, []);

	//clickedMemoLineがクリックされたときにフォーカスを移動する関数
	const handleOnclick = (clickedMemoLine: MemoLine) => {
		setFocusedMemoLineId(clickedMemoLine.id); // フォーカスを変更したいmemoLineのIDを設定
	};

	// テキストエリアがクリックされたときにフォーカスを移動する関数
	const setFocus = (clickedMemoLineId: string) => {
		setMemoLines((prevMemoLines) =>
			prevMemoLines.map((memoLine) => ({
				...memoLine,
				isFocus: memoLine.id === clickedMemoLineId,
			}))
		);
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={memoLines}
				strategy={verticalListSortingStrategy}
			>
				{memoLines.map((memoLine, index) => (
					<div
						key={memoLine.id}
						ref={(el) => (memoLineRefs.current[index] = el)}
					>
						{!memoLine.isFocus ? (
							// clickされたらisFocusをtrueにして、textarea表示に切り替える
							<Box onClick={() => handleOnclick(memoLine)}>
								<ReactMarkdown>{memoLine.text}</ReactMarkdown>
							</Box>
						) : (
							<div style={style} {...attributes}>
								<textarea
									value={memoLine.text}
									onChange={(e) =>
										setValue(memoLine.id, e.target.value)
									}
									onClick={() => handleOnclick(memoLine)}
									onKeyDown={(e) =>
										handleKeyDown(e, memoLine, index)
									}
									style={{
										width: "100%",
										height: "auto",
										minHeight: "2.3vh",
										resize: "none",
										overflow: "hidden", // テキストエリアのスクロールバーを非表示
										border: "none",
										backgroundColor: memoLine.isFocus // フォーカスされているテキストエリアの背景色を変更
											? "rgba(0, 0, 0, 0.1)"
											: "transparent",
									}}
								/>
							</div>
						)}
					</div>
				))}
			</SortableContext>
		</DndContext>
	);
};

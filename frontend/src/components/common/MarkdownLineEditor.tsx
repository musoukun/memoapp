/* eslint-disable prefer-const */
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
import { CSS, add } from "@dnd-kit/utilities";
import ReactMarkdown from "react-markdown";
import { Box, TextField, useTheme } from "@mui/material";
import { useRecoilState } from "recoil";
import { memoLineAtom, memoLinesAtom } from "../../atoms/memoLineAtom";
import { MemoLine } from "../../types/memoLine.ts";
import textFieldStyles from "../../style/textFieldStyles.ts";
import reactMarkdownStyles from "../../style/reactMarkdownStyles.ts";
import { descriptionStateAtom } from "../../atoms/descriptionAtom.ts";

// スタイルシート（CSS in JSの形式で示しますが、普通のCSSとしても同じことができます）
// ブラウザのdark modeにあわせてstyleを設定したい

export const MarkdownLineEditor = () => {
	const theme = useTheme();

	// テキストエリアのリストを管理するための状態
	const [memoLines, setMemoLines] = useRecoilState(memoLinesAtom);
	const [description, setDescription] = useRecoilState(descriptionStateAtom);

	// 新しいメモラインを追加するための状態
	const [isAddingNewLine, setIsAddingNewLine] = useState(false);

	// フォーカスを変更したいmemoLineのIDを一時保存するための状態
	const [focusedMemoLineId, setFocusedMemoLineId] = useState<string | null>(
		null
	);

	const [debounceTime, setDebounceTime] = useState<number>(700); // デバウンス時間を状態として保存
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null); // タイマーを保存するためのref

	// 新しいメモラインを一時的に保存するための状態
	const [newLine, setNewLine] = useState<MemoLine>();

	// 各memoLineの全体に対する参照を保持する配列
	const memoLineRefs = useRef<(HTMLDivElement | null)[]>([]);
	// テキストエリアの参照を保持するref
	const textFieldRef = useRef<HTMLTextAreaElement>(null);

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

	useEffect(() => {
		// memoLines.textを順番に取得して、改行コード区切りでdescriptionにセットする関数
		const joinMemoLines = () => {
			setDescription(
				memoLines
					.map((memoLine: MemoLine) => memoLine.text)
					.filter((text: string) => text)
					.join("\n")
			);
		};
		if (timer.current) clearTimeout(timer.current); // タイマーが存在する場合はクリア

		timer.current = setTimeout(async () => {
			// 一定時間後に実行
			joinMemoLines();
			console.log("description:", description);
		}, debounceTime); //debounceTime は state で管理
	}, [memoLines]);

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
		const changeFocus = () => {
			console.log("変更前:", memoLines);

			if (focusedMemoLineId) {
				setMemoLines((currentMemoLines) =>
					currentMemoLines.map((memoLine) => ({
						...memoLine,
						isFocus: memoLine.id === focusedMemoLineId,
					}))
				);

				const index = memoLines.findIndex(
					(line) => line.id === focusedMemoLineId
				);

				if (index !== -1) {
					memoLineRefs.current[index]?.focus();
					setFocusedMemoLineId(null);
				}
			}

			if (newLine && textFieldRef.current) {
				textFieldRef.current.focus();
				textFieldRef.current.click();
				setNewLine(undefined);
			}
		};

		changeFocus();
		console.log("変更後:", memoLines);
	}, [focusedMemoLineId, newLine]);

	// テキストエリアのKeyDownイベントを処理する関数
	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLDivElement>,
		index: number
	) => {
		const currentIndex = memoLines.findIndex((line) => line.isFocus); // フォーカスされているメモラインのindexを取得
		if (currentIndex === -1) {
			//	フォーカスされているメモラインがない場合は何もしない
			return;
		}

		const lastIndex = memoLines.length - 1; // メモラインの最後のindexを取得
		let newIndex; // 新しいindexを格納する変数

		if (e.key === "Enter") {
			e.preventDefault(); // デフォルトの挙動を阻止
			if (!isAddingNewLine) {
				setIsAddingNewLine(true); // 追加処理開始
				addMemoLine(index + 1).then((newLine) => {
					// addMemoLineの処理が終わったら、新しいメモラインの情報をsetNewLineで追加
					setNewLine(newLine);
					setIsAddingNewLine(false); // 追加処理終了
				});
			}
		}

		if (e.key === "ArrowUp") {
			e.preventDefault(); // デフォルトの挙動を阻止
			// 矢印キーを押したときの処理
			newIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
		}
		if (e.key === "ArrowDown") {
			e.preventDefault(); // デフォルトの挙動を阻止
			// 矢印キーを押したときの処理
			newIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
		}

		newIndex !== undefined && setFocusedMemoLineId(memoLines[newIndex].id);
	};

	// memo を追加する関数
	const addMemoLine = useCallback(async (index: number) => {
		// 新しいメモラインを追加
		return new Promise<MemoLine>((resolve) => {
			setMemoLines((currentMemoLines) => {
				const newLines = [
					...currentMemoLines.slice(0, index),
					{ id: uuidv4(), text: "", isFocus: true },
					...currentMemoLines.slice(index),
				];

				resolve(newLines[index]); // 新しいメモラインの情報をresolveで返す
				return newLines;
			});
		});
	}, []);

	const handleChange = (
		e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
		id: string
	) => {
		const newText = e.target.value;
		// 新しいテキストが現在のテキストと異なる場合のみ状態を更新
		const memoLine = memoLines.find((line) => line.id === id);
		if (memoLine && memoLine.text !== newText) {
			setMemoLines(
				memoLines.map((line) =>
					line.id === id ? { ...line, text: newText } : line
				)
			);
		}
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
							// memoLine.textが空の場合はplaceholderを設定
							<Box
								onClick={() =>
									setFocusedMemoLineId(memoLine.id)
								}
								sx={{ ...reactMarkdownStyles }}
							>
								{!memoLine.text ? (
									<Box
										className="markdownContainer"
										sx={{
											...textFieldStyles,
											visibility: memoLine.isFocus
												? "visible"
												: "hidden",
										}}
									>
										{"文字を入力してください"}
									</Box>
								) : null}

								<ReactMarkdown className="markdownContainer">
									{memoLine.text}
								</ReactMarkdown>
							</Box>
						) : (
							<TextField
								inputRef={textFieldRef}
								value={memoLine.text}
								onChange={(e) => handleChange(e, memoLine.id)}
								onClick={() =>
									setFocusedMemoLineId(memoLine.id)
								}
								onKeyDown={(e) => handleKeyDown(e, index)}
								placeholder="テキストを入力してください"
								InputProps={{ notched: false }} // ノッチ（枠線の切り欠き部分）を非表示にする
								fullWidth
								multiline
								variant="outlined"
								sx={{ ...textFieldStyles }}
							/>
						)}
					</div>
				))}
			</SortableContext>
		</DndContext>
	);
};

/* eslint-disable react-hooks/exhaustive-deps */
import React, {
	useEffect,
	useNote,
	useState,
	useCallback,
	useRef,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BlockNoteView } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import "@mantine/core/styles.css";
import noteApi from "../../api/noteApi";
import { useNoteUpdate } from "../../hooks/useNoteUpdate";
import EmojiPicker from "../common/EmojiPicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { customTheme } from "../blocknoteComponent/BlocknoteTheme";

const Note: React.FC = () => {
	// ナビゲーション関連のフック
	const navigate = useNavigate();
	const { id } = useParams(); // URLからメモIDを取得

	// カスタムフックとRecoil状態管理
	const { updateNote, updateSidebarInfo } = useNoteUpdate();

	const [note, setNote] = useState<{
		title: string;
		description: string;
		icon: string;
		favorite: boolean;
	} | null>(null);

	// 初期コンテンツの状態。
	const [initialContent, setInitialContent] = useState<
		PartialBlock[] | undefined
	>(undefined);

	const searchParams = new URLSearchParams(location.search);

	// 参照を使用した状態管理
	const savingRef = useRef(false); // 保存中かどうかを追跡
	const noteRef = useRef(note); // 最新のnote状態を追跡
	const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null); // デバウンス用のタイマーを追跡
	const editorRef = useRef<HTMLDivElement>(null); // エディタのDOM要素への参照
	const titleRef = useRef<HTMLInputElement>(null); // タイトル入力フィールドへの参照

	// noteの更新時にrefを更新
	useEffect(() => {
		// noteが変更されるたびに、noteRefを更新
		noteRef.current = note;
	}, [note]);

	// コンポーネントマウント時にメモを読み込む
	useEffect(() => {
		// APIからメモを取得する関数
		const loadFromAPI = async () => {
			try {
				// APIからメモデータを取得
				const fetchedNote = await noteApi.show(id as string);
				// ローカル状態とグローバル状態を更新
				setNote(fetchedNote.data);
				// メモの説明がある場合はJSONをパースして返す、なければundefined
				console.log("Fetched note:", fetchedNote.data.description);

				return JSON.parse(
					fetchedNote.data.description
				) as PartialBlock[];
			} catch (err) {
				console.error("Failed to fetch note:", err);
			}
		};

		const emptyBlock: PartialBlock[] = [
			{
				type: "paragraph",
				content: "",
			},
		];

		// 新規メモの場合は初期コンテンツを空のブロックに設定
		if (searchParams.get("new") === "true") {
			setInitialContent(emptyBlock);
			// Titleを空に設定
			setNote({
				title: "",
				description: JSON.stringify(emptyBlock),
				icon: "📝",
				favorite: false,
			});
			// titleにマウスカーソルを移動
			titleRef.current?.focus();
		} else {
			// APIからデータを取得し、initialContentを設定
			// thenとは、Promiseが成功した場合に呼び出される関数
			// contentは、loadFromAPI()の返り値
			loadFromAPI().then((content) => {
				console.log("Initial content loaded:", content);
				setInitialContent(content);
			});
		}
	}, [id]);

	// BlockNoteエディタの初期化
	// initialContentが空またはundefinedの場合はeditorインスタンスを生成する
	const editor = useNote(() => {
		if (!initialContent === undefined) {
			// メモの作成に失敗していることをエラー通知
			console.error(
				"Failed to create editor: initial content is loading"
			);
			// 初期コンテンツがない場合はnullを返す
			return null;
		}

		return BlockNoteEditor.create({ initialContent }) as BlockNoteEditor;
	}, [initialContent]);

	// 更新処理をデバウンスする関数
	const debouncedUpdate = (
		debouncedTime: number,
		updateFn: () => Promise<void>
	) => {
		// 既存のタイマーがあればクリア
		if (updateTimeoutRef.current) {
			clearTimeout(updateTimeoutRef.current);
		}
		// 新しいタイマーをセット
		updateTimeoutRef.current = setTimeout(async () => {
			savingRef.current = true; // 保存中フラグをセット
			try {
				await updateFn(); // 更新関数を実行
				console.log("Updated content");
			} catch (error) {
				console.error("Failed to update:", error);
			} finally {
				savingRef.current = false; // 保存中フラグをリセット
			}
		}, debouncedTime); // 1.3秒のデバウンス
	};

	// エディタの内容が変更されたときのハンドラ
	const handleContentChange = () => {
		if (editor && noteRef.current) {
			// エディタの内容をJSON文字列に変換
			const newDescription = JSON.stringify(editor.document);
			// ローカル状態を更新
			setNote((prev) => ({ ...prev!, description: newDescription }));
			// デバウンスされた更新を実行
			debouncedUpdate(1300, async () => {
				if (id && noteRef.current) {
					// APIを呼び出してメモを更新
					await updateNote(id, { description: newDescription });
				}
			});
		}
	};

	// タイトルが変更されたときのハンドラ
	const handleTitleChange = (newTitle: string) => {
		if (id && noteRef.current) {
			// ローカル状態を更新
			setNote((prev) => ({ ...prev!, title: newTitle }));
			// デバウンスされた更新を実行
			debouncedUpdate(300, async () => {
				if (id && noteRef.current) {
					// APIを呼び出してメモを更新
					await updateNote(id, { title: newTitle });
					// サイドバーの情報も更新
					updateSidebarInfo(id, { title: newTitle });
				}
			});
		}
	};

	// タイトル入力フィールドでEnterキーが押されたときのハンドラ
	const handleTitleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") {
				e.preventDefault(); // デフォルトの改行を防止
				editorRef.current?.focus(); // エディタにフォーカスを移動
				editor?.focus(); // エディタ内部のフォーカス処理
			}
		},
		[editor]
	);

	// お気に入り状態をトグルするハンドラ
	const handleFavoriteToggle = async () => {
		if (id && noteRef.current) {
			const newFavorite = !noteRef.current.favorite;
			// ローカル状態を更新
			setNote((prev) => ({ ...prev!, favorite: newFavorite }));
			// APIを呼び出してメモを更新
			await updateNote(id, { favorite: newFavorite });
			// サイドバーの情報も更新
			updateSidebarInfo(id, { favorite: newFavorite });
		}
	};

	// アイコンが変更されたときのハンドラ
	const handleIconChange = async (newIcon: string) => {
		if (id && noteRef.current) {
			// ローカル状態を更新
			setNote((prev) => ({ ...prev!, icon: newIcon }));
			// APIを呼び出してメモを更新
			await updateNote(id, { icon: newIcon });
			// サイドバーの情報も更新
			updateSidebarInfo(id, { icon: newIcon });
		}
	};

	// メモを削除するハンドラ
	const deleteNote = async () => {
		if (id) {
			try {
				// APIを呼び出してメモを削除
				await noteApi.delete(id);
				// サイドバーの情報も更新
				updateSidebarInfo(id, { delete: true });
				// メモ一覧ページにナビゲート
				navigate("/note");
			} catch (error) {
				console.error("Failed to delete note:", error);
			}
		}
	};

	// noteまたはeditorがない場合はnullを返す
	if (!note || !editor) {
		return null;
	}

	// メインのレンダリング
	return (
		<div className="relative bg-white dark:bg-gray-800 text-black dark:text-white min-h-screen">
			{/* 保存中の表示 */}
			<div className="absolute top-0 right-0 p-1">
				{savingRef.current && (
					<span className="text-sm text-gray-500">Saving...</span>
				)}
			</div>
			{/* お気に入りと削除ボタン */}
			<div className="flex items-center w-full ml-12 pt-4">
				<button
					onClick={handleFavoriteToggle}
					className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
				>
					{note.favorite ? (
						<FontAwesomeIcon
							icon={faStar}
							className="text-yellow-500"
						/>
					) : (
						<FontAwesomeIcon
							icon={faStar}
							className="text-gray-400"
						/>
					)}
				</button>
				<button
					onClick={deleteNote}
					className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-red-500"
				>
					<FontAwesomeIcon icon={faTrashAlt} />
				</button>
			</div>
			{/* アイコンとタイトル入力 */}
			<div className="ml-12 mt-2">
				<div className="p-1 h-8 mb-5">
					<EmojiPicker icon={note.icon} onChange={handleIconChange} />
				</div>
				<input
					value={note.title}
					onChange={(e) => handleTitleChange(e.target.value)}
					onKeyDown={handleTitleKeyDown}
					className="w-full p-2 mb-3 text-4xl font-bold outline-none bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 text-gray-800 dark:text-gray-200"
					placeholder="無題"
					ref={titleRef}
				/>
			</div>
			{/* BlockNoteエディタ */}
			<div className="ml-2" ref={editorRef}>
				{editor && (
					<BlockNoteView
						editor={editor}
						onChange={handleContentChange}
						theme={customTheme}
					/>
				)}
			</div>
		</div>
	);
};

export default Note;

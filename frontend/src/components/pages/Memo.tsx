import React, {
	useEffect,
	useMemo,
	useState,
	useCallback,
	useRef,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	BlockNoteView,
	darkDefaultTheme,
	lightDefaultTheme,
	useBlockNote,
} from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import "@mantine/core/styles.css";
import memoApi from "../../api/memoApi";
import { useMemoUpdate } from "../../hooks/useMemoUpdate";
import EmojiPicker from "../common/EmojiPicker";
import { useSetRecoilState } from "recoil";
import { memoStateAtom } from "../../atoms/memoAtoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { PartialBlock } from "@blocknote/core";

const Memo: React.FC = () => {
	// ナビゲーション関連のフック
	const navigate = useNavigate();
	const { id } = useParams(); // URLからメモIDを取得

	// カスタムフックとRecoil状態管理
	const { updateMemo, updateSidebarInfo } = useMemoUpdate();
	const setMemoState = useSetRecoilState(memoStateAtom);

	// ローカルの状態管理
	const [localMemo, setLocalMemo] = useState<{
		title: string;
		description: string;
		icon: string;
		favorite: boolean;
	} | null>(null);
	// 初期コンテンツの状態。"loading"、undefined、またはPartialBlock[]のいずれか
	const [initialContent, setInitialContent] = useState<
		PartialBlock[] | undefined | "loading"
	>("loading");

	// 参照を使用した状態管理
	const savingRef = useRef(false); // 保存中かどうかを追跡
	const localMemoRef = useRef(localMemo); // 最新のlocalMemo状態を追跡
	const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null); // デバウンス用のタイマーを追跡
	const editorRef = useRef<HTMLDivElement>(null); // エディタのDOM要素への参照

	// localMemoの更新時にrefを更新
	useEffect(() => {
		// localMemoが変更されるたびに、localMemoRefを更新
		localMemoRef.current = localMemo;
	}, [localMemo]);

	// APIからメモを取得する関数
	const loadFromAPI = useCallback(async () => {
		if (id) {
			try {
				// APIからメモデータを取得
				const fetchedMemo = await memoApi.show(id);
				// ローカル状態とグローバル状態を更新
				setLocalMemo(fetchedMemo.data);
				setMemoState(fetchedMemo.data);
				// メモの説明がある場合はJSONをパースして返す、なければundefined
				return fetchedMemo.data.description
					? (JSON.parse(
							fetchedMemo.data.description
						) as PartialBlock[])
					: undefined;
			} catch (err) {
				console.error("Failed to fetch memo:", err);
				return undefined;
			}
		}
	}, [id, setMemoState]);

	// コンポーネントマウント時にメモを読み込む
	useEffect(() => {
		// APIからデータを取得し、initialContentを設定
		loadFromAPI().then((content) => {
			setInitialContent(content);
		});
	}, [loadFromAPI]);

	// BlockNoteエディタの初期化
	const editor = useBlockNote({
		// 初期コンテンツが"loading"の場合はundefinedを使用、それ以外は初期コンテンツを使用
		initialContent:
			initialContent === "loading" ? undefined : initialContent,
	});

	// 更新処理をデバウンスする関数
	const debouncedUpdate = useCallback((updateFn: () => Promise<void>) => {
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
		}, 1300); // 1.3秒のデバウンス
	}, []);

	// エディタの内容が変更されたときのハンドラ
	const handleContentChange = useCallback(() => {
		if (editor && localMemoRef.current) {
			// エディタの内容をJSON文字列に変換
			const newDescription = JSON.stringify(editor.document);
			// ローカル状態を更新
			setLocalMemo((prev) => ({ ...prev!, description: newDescription }));
			// デバウンスされた更新を実行
			debouncedUpdate(async () => {
				if (id && localMemoRef.current) {
					// APIを呼び出してメモを更新
					await updateMemo(id, { description: newDescription });
				}
			});
		}
	}, [editor, id, updateMemo, debouncedUpdate]);

	// タイトルが変更されたときのハンドラ
	const handleTitleChange = useCallback(
		(newTitle: string) => {
			if (id && localMemoRef.current) {
				// ローカル状態を更新
				setLocalMemo((prev) => ({ ...prev!, title: newTitle }));
				// デバウンスされた更新を実行
				debouncedUpdate(async () => {
					if (id && localMemoRef.current) {
						// APIを呼び出してメモを更新
						await updateMemo(id, { title: newTitle });
						// サイドバーの情報も更新
						updateSidebarInfo(id, { title: newTitle });
					}
				});
			}
		},
		[id, updateMemo, updateSidebarInfo, debouncedUpdate]
	);

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
	const handleFavoriteToggle = useCallback(async () => {
		if (id && localMemoRef.current) {
			const newFavorite = !localMemoRef.current.favorite;
			// ローカル状態を更新
			setLocalMemo((prev) => ({ ...prev!, favorite: newFavorite }));
			// APIを呼び出してメモを更新
			await updateMemo(id, { favorite: newFavorite });
			// サイドバーの情報も更新
			updateSidebarInfo(id, { favorite: newFavorite });
		}
	}, [id, updateMemo, updateSidebarInfo]);

	// アイコンが変更されたときのハンドラ
	const handleIconChange = useCallback(
		async (newIcon: string) => {
			if (id && localMemoRef.current) {
				// ローカル状態を更新
				setLocalMemo((prev) => ({ ...prev!, icon: newIcon }));
				// APIを呼び出してメモを更新
				await updateMemo(id, { icon: newIcon });
				// サイドバーの情報も更新
				updateSidebarInfo(id, { icon: newIcon });
			}
		},
		[id, updateMemo, updateSidebarInfo]
	);

	// メモを削除するハンドラ
	const deleteMemo = useCallback(async () => {
		if (id) {
			try {
				// APIを呼び出してメモを削除
				await memoApi.delete(id);
				// メモ一覧ページにナビゲート
				navigate("/memo");
			} catch (error) {
				console.error("Failed to delete memo:", error);
			}
		}
	}, [id, navigate]);

	// エディタのカスタムテーマ設定
	const customTheme = useMemo(
		() => ({
			light: {
				...lightDefaultTheme,
				colors: {
					...lightDefaultTheme.colors,
					editor: {
						text: "#000000",
						background: "#ffffff",
					},
				},
				fontSize: "1.1em",
			},
			dark: {
				...darkDefaultTheme,
				colors: {
					...darkDefaultTheme.colors,
					editor: {
						text: "#ffffff",
						background: "#1f2937",
					},
				},
				fontSize: "1.1em",
			},
		}),
		[]
	);

	// 初期ロード中またはデータがない場合はローディング表示
	if (initialContent === "loading" || !localMemo) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading...
			</div>
		);
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
					{localMemo.favorite ? (
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
					onClick={deleteMemo}
					className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-red-500"
				>
					<FontAwesomeIcon icon={faTrashAlt} />
				</button>
			</div>
			{/* アイコンとタイトル入力 */}
			<div className="ml-12 mt-2">
				<div className="p-1 h-8 mb-5">
					<EmojiPicker
						icon={localMemo.icon}
						onChange={handleIconChange}
					/>
				</div>
				<input
					value={localMemo.title}
					onChange={(e) => handleTitleChange(e.target.value)}
					onKeyDown={handleTitleKeyDown}
					className="w-full p-2 mb-3 text-4xl font-bold outline-none bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 text-gray-800 dark:text-gray-200"
					placeholder=""
				/>
			</div>
			{/* BlockNoteエディタ */}
			<div className="ml-2" ref={editorRef}>
				<BlockNoteView
					editor={editor}
					onChange={handleContentChange}
					theme={customTheme}
				/>
			</div>
		</div>
	);
};

export default Memo;

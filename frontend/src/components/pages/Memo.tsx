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
} from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import "@mantine/core/styles.css";
import memoApi from "../../api/memoApi";
import { useMemoUpdate } from "../../hooks/useMemoUpdate";
import EmojiPicker from "../common/EmojiPicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";

const Memo: React.FC = () => {
	// ナビゲーション関連のフック
	const navigate = useNavigate();
	const { id } = useParams(); // URLからメモIDを取得

	// カスタムフックとRecoil状態管理
	const { updateMemo, updateSidebarInfo } = useMemoUpdate();

	const [memo, setMemo] = useState<{
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
	const memoRef = useRef(memo); // 最新のmemo状態を追跡
	const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null); // デバウンス用のタイマーを追跡
	const editorRef = useRef<HTMLDivElement>(null); // エディタのDOM要素への参照

	// memoの更新時にrefを更新
	useEffect(() => {
		// memoが変更されるたびに、memoRefを更新
		memoRef.current = memo;
	}, [memo]);

	// コンポーネントマウント時にメモを読み込む
	useEffect(() => {
		// APIからメモを取得する関数
		const loadFromAPI = async () => {
			try {
				// APIからメモデータを取得
				const fetchedMemo = await memoApi.show(id as string);
				// ローカル状態とグローバル状態を更新
				setMemo(fetchedMemo.data);
				// メモの説明がある場合はJSONをパースして返す、なければundefined
				console.log("Fetched memo:", fetchedMemo.data.description);
				return fetchedMemo.data.description
					? (JSON.parse(
							fetchedMemo.data.description
						) as PartialBlock[])
					: undefined;
			} catch (err) {
				console.error("Failed to fetch memo:", err);
				return undefined;
			}
		};

		// APIからデータを取得し、initialContentを設定
		// thenとは、Promiseが成功した場合に呼び出される関数
		// contentは、loadFromAPI()の返り値
		loadFromAPI().then((content) => {
			console.log("Initial content loaded:", content);
			setInitialContent(content);
		});
	}, [id]);

	// BlockNoteエディタの初期化
	const editor = useMemo(() => {
		// 初期コンテンツが"loading"の場合はnullを返す
		if (initialContent === "loading") {
			return null;
		}
		return BlockNoteEditor.create({ initialContent }) as BlockNoteEditor;
	}, [initialContent]);

	// 更新処理をデバウンスする関数
	const debouncedUpdate = (updateFn: () => Promise<void>) => {
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
	};

	// エディタの内容が変更されたときのハンドラ
	const handleContentChange = () => {
		if (editor && memoRef.current) {
			// エディタの内容をJSON文字列に変換
			const newDescription = JSON.stringify(editor.document);
			// ローカル状態を更新
			setMemo((prev) => ({ ...prev!, description: newDescription }));
			// デバウンスされた更新を実行
			debouncedUpdate(async () => {
				if (id && memoRef.current) {
					// APIを呼び出してメモを更新
					await updateMemo(id, { description: newDescription });
				}
			});
		}
	};

	// タイトルが変更されたときのハンドラ
	const handleTitleChange = (newTitle: string) => {
		if (id && memoRef.current) {
			// ローカル状態を更新
			setMemo((prev) => ({ ...prev!, title: newTitle }));
			// デバウンスされた更新を実行
			debouncedUpdate(async () => {
				if (id && memoRef.current) {
					// APIを呼び出してメモを更新
					await updateMemo(id, { title: newTitle });
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
		if (id && memoRef.current) {
			const newFavorite = !memoRef.current.favorite;
			// ローカル状態を更新
			setMemo((prev) => ({ ...prev!, favorite: newFavorite }));
			// APIを呼び出してメモを更新
			await updateMemo(id, { favorite: newFavorite });
			// サイドバーの情報も更新
			updateSidebarInfo(id, { favorite: newFavorite });
		}
	};

	// アイコンが変更されたときのハンドラ
	const handleIconChange = async (newIcon: string) => {
		if (id && memoRef.current) {
			// ローカル状態を更新
			setMemo((prev) => ({ ...prev!, icon: newIcon }));
			// APIを呼び出してメモを更新
			await updateMemo(id, { icon: newIcon });
			// サイドバーの情報も更新
			updateSidebarInfo(id, { icon: newIcon });
		}
	};

	// メモを削除するハンドラ
	const deleteMemo = async () => {
		if (id) {
			try {
				// APIを呼び出してメモを削除
				await memoApi.delete(id);
				// サイドバーの情報も更新
				updateSidebarInfo(id, { delete: true });
				// メモ一覧ページにナビゲート
				navigate("/memo");
			} catch (error) {
				console.error("Failed to delete memo:", error);
			}
		}
	};

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
	if (initialContent === "loading" || !memo) {
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
					{memo.favorite ? (
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
					<EmojiPicker icon={memo.icon} onChange={handleIconChange} />
				</div>
				<input
					value={memo.title}
					onChange={(e) => handleTitleChange(e.target.value)}
					onKeyDown={handleTitleKeyDown}
					className="w-full p-2 mb-3 text-4xl font-bold outline-none bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 text-gray-800 dark:text-gray-200"
					placeholder=""
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

export default Memo;

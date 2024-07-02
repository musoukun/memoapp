import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import "@mantine/core/styles.css";
import memoApi from "../../api/memoApi";
import { useMemoUpdate } from "../../hooks/useMemoUpdate";
import EmojiPicker from "../common/EmojiPicker";
import { useRecoilState } from "recoil";
import { memoStateAtom } from "../../atoms/memoAtoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const Memo: React.FC = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { updateMemo, updateSidebarInfo } = useMemoUpdate();
	const [memo, setMemo] = useRecoilState(memoStateAtom);
	const [isNewMemo, setIsNewMemo] = useState(false);
	const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const contentToSaveRef = useRef<string | null>(null);
	const latestContentRef = useRef<string | null>(null);

	useEffect(() => {
		const fetchMemo = async () => {
			if (id) {
				try {
					const fetchedMemo = await memoApi.show(id);
					if (fetchedMemo.data) {
						setMemo(fetchedMemo.data);
					} else {
						setIsNewMemo(true);
					}
				} catch (err) {
					console.error("Failed to fetch memo:", err);
					setIsNewMemo(true);
				}
			}
		};
		fetchMemo();
	}, [id, setMemo]);

	const editor = useCreateBlockNote({
		initialContent: memo?.description
			? JSON.parse(memo.description)
			: [{ type: "paragraph", content: [] }],
	});

	const saveContent = useCallback(async () => {
		if (contentToSaveRef.current !== null && id && memo) {
			try {
				await updateMemo(id, { description: contentToSaveRef.current });
				setMemo((prevMemo) => ({
					...prevMemo,
					description: contentToSaveRef.current!,
				}));
				contentToSaveRef.current = null;
			} catch (error) {
				console.error("Failed to update content:", error);
			}
		}
	}, [id, memo, updateMemo, setMemo]);

	const scheduleContentSave = useCallback(() => {
		if (updateTimeoutRef.current) {
			clearTimeout(updateTimeoutRef.current);
		}

		updateTimeoutRef.current = setTimeout(() => {
			if (latestContentRef.current !== contentToSaveRef.current) {
				contentToSaveRef.current = latestContentRef.current;
				saveContent();
			}
		}, 1000);
	}, [saveContent]);

	const handleContentChange = useCallback(() => {
		if (editor) {
			const newContent = JSON.stringify(editor.document);
			latestContentRef.current = newContent;
			scheduleContentSave();
		}
	}, [editor, scheduleContentSave]);

	useEffect(() => {
		return () => {
			if (updateTimeoutRef.current) {
				clearTimeout(updateTimeoutRef.current);
			}
		};
	}, []);

	const handleTitleChange = async (newTitle: string) => {
		if (memo) {
			setMemo({ ...memo, title: newTitle });
			if (id) {
				try {
					if (isNewMemo) {
						const createdMemo = await memoApi.create(newTitle);
						setMemo(createdMemo.data);
						setIsNewMemo(false);
						navigate(`/memo/${createdMemo.data.id}`, {
							replace: true,
						});
					} else {
						await updateMemo(id, { title: newTitle });
					}
					updateSidebarInfo(id, { title: newTitle });
				} catch (error) {
					console.error("Failed to update title:", error);
				}
			}
		}
	};

	const handleFavoriteToggle = async () => {
		if (id && memo) {
			const newFavorite = !memo.favorite;
			await updateMemo(id, { favorite: newFavorite });
			setMemo({ ...memo, favorite: newFavorite });
			updateSidebarInfo(id, { favorite: newFavorite });
		}
	};

	const handleIconChange = async (newIcon: string) => {
		if (id && memo) {
			await updateMemo(id, { icon: newIcon });
			setMemo({ ...memo, icon: newIcon });
			updateSidebarInfo(id, { icon: newIcon });
		}
	};

	const deleteMemo = async () => {
		if (id) {
			try {
				await memoApi.delete(id);
				navigate("/memo");
			} catch (error) {
				console.error("Failed to delete memo:", error);
			}
		}
	};

	if (!memo) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading...
			</div>
		);
	}

	// カスタムテーマの定義
	const customTheme = {
		light: {
			colors: {
				editor: {
					text: "#3f3f3f",
					background: "#ffffff",
				},
			},
		},
		dark: {
			colors: {
				editor: {
					text: "#ffffff",
					background: "#1f2937", // ダークモードの背景色を設定
				},
			},
		},
	};

	return (
		<div className="relative bg-white dark:bg-gray-800 text-black dark:text-white min-h-screen">
			<div className="flex items-center w-full ml-12 pt-4">
				<button
					onClick={handleFavoriteToggle}
					className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
				>
					<FontAwesomeIcon
						icon={faStar}
						className={
							memo.favorite ? "text-yellow-500" : "text-gray-400"
						}
					/>
				</button>
				<button
					onClick={deleteMemo}
					className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-red-500"
				>
					<FontAwesomeIcon icon={faTrashAlt} />
				</button>
			</div>
			<div className="ml-12 mt-3">
				<div className="p-1 h-8 mb-6">
					<EmojiPicker icon={memo.icon} onChange={handleIconChange} />
				</div>
				<input
					value={memo.title}
					onChange={(e) => handleTitleChange(e.target.value)}
					className="w-full p-2 text-4xl font-bold outline-none bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 text-gray-800 dark:text-gray-200"
					placeholder=""
				/>
			</div>
			<div className="ml-2">
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

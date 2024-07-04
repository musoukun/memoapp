import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	BlockNoteView,
	darkDefaultTheme,
	lightDefaultTheme,
} from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import "@mantine/core/styles.css";
import debounce from "lodash/debounce";
import memoApi from "../../api/memoApi";
import { useMemoUpdate } from "../../hooks/useMemoUpdate";
import EmojiPicker from "../common/EmojiPicker";
import { useRecoilState } from "recoil";
import { memoStateAtom } from "../../atoms/memoAtoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";

const Memo: React.FC = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { updateMemo, updateSidebarInfo } = useMemoUpdate();
	const [memo, setMemo] = useRecoilState(memoStateAtom);
	const [initialContent, setInitialContent] = useState<
		PartialBlock[] | undefined | "loading"
	>("loading");

	const loadFromAPI = async () => {
		if (id) {
			try {
				const fetchedMemo = await memoApi.show(id);
				setMemo(fetchedMemo.data);
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
	};

	useEffect(() => {
		loadFromAPI().then((content) => {
			setInitialContent(content);
		});
	}, [id]);

	const editor = useMemo(() => {
		if (initialContent === "loading") {
			return undefined;
		}
		return BlockNoteEditor.create({ initialContent });
	}, [initialContent]);

	const debouncedUpdateContent = useCallback(
		debounce(async (newDescription: string) => {
			if (id && memo) {
				await updateMemo(id, { description: newDescription });
				console.log("Updated content");
			}
		}, 1300),
		[id, memo, updateMemo]
	);

	const handleContentChange = () => {
		if (editor) {
			const newDescription = JSON.stringify(editor.topLevelBlocks);
			if (memo) {
				setMemo({ ...memo, description: newDescription });
				debouncedUpdateContent(newDescription);
			}
		}
	};

	const debouncedUpdateTitle = useCallback(
		debounce(async (newTitle: string) => {
			if (id && memo) {
				try {
					await updateMemo(id, { title: newTitle });
				} catch (error) {
					console.error("Failed to update title:", error);
				}
			}
		}, 1300),
		[id, memo, updateMemo]
	);

	const handleTitleChange = (newTitle: string) => {
		if (id && memo) {
			setMemo({ ...memo, title: newTitle });
			debouncedUpdateTitle(newTitle);
			updateSidebarInfo(id, { title: newTitle });
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

	if (editor === undefined) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading...
			</div>
		);
	}

	const customTheme = {
		light: {
			...lightDefaultTheme,
			colors: {
				...lightDefaultTheme.colors,
				editor: {
					text: "#000000",
					background: "#ffffff",
				},
			},
			fontSize: "1.1em", // Increase font size
		},
		dark: {
			...darkDefaultTheme,
			colors: {
				...darkDefaultTheme.colors,
				editor: {
					text: "#ffffff",
					background: "#1f2937", // This corresponds to Tailwind's bg-gray-800
				},
			},
			fontSize: "1.1em", // Increase font size
		},
	};

	return (
		<div className="relative bg-white dark:bg-gray-800 text-black dark:text-white min-h-screen ml-12">
			<div className="absolute top-0 right-0 p-1 z-10"></div>
			<div className="flex items-center w-full ml-12 pt-4">
				<button
					onClick={handleFavoriteToggle}
					className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
				>
					{memo?.favorite ? (
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
			<div className="ml-12 mt-2">
				<div className="p-1 h-8 mb-5">
					<EmojiPicker
						icon={memo?.icon}
						onChange={handleIconChange}
					/>
				</div>
				<input
					value={memo?.title || ""}
					onChange={(e) => handleTitleChange(e.target.value)}
					className="w-full p-2 text-4xl font-bold outline-none bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 text-gray-800 dark:text-gray-200"
					placeholder="無題"
				/>
			</div>
			<div className="ml-2">
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

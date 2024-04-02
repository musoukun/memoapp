/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import "@blocknote/core/fonts/inter.css";
import {
	BlockColorsItem,
	BlockNoteView,
	DragHandleMenu,
	DragHandleMenuItem,
	RemoveBlockItem,
	SideMenu,
	SideMenuController,
	useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/react/style.css";
import { useEffect, useMemo, useState } from "react";
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import mantine from "@mantine/core";
import "@mantine/core/styles.css";

import { useTheme } from "@mui/material";
import { useRecoilState } from "recoil";
import {
	descriptionStateAtom,
	initialContentStateAtom,
} from "../../atoms/descriptionAtom";
import { updateMemoflgAtom } from "../../atoms/memoAtoms";

const editor = () => {
	const theme = useTheme();
	const [description, setDescription] = useRecoilState(descriptionStateAtom);
	const [updateMemoflg, setUpdateMemoflg] = useRecoilState(updateMemoflgAtom);

	const handleOnChange = (document: Block[]) => {
		setUpdateMemoflg(true);
		const json = JSON.stringify(document);
		setDescription(json);
	};

	const [initialContent, setInitialContent] = useRecoilState(
		initialContentStateAtom
	);

	useEffect(() => {
		if (description === "loading") {
			return;
		}

		if (description === "{}" || description === "") {
			const init: PartialBlock[] = [
				{
					type: "paragraph",
					props: {
						backgroundColor: "default",
						textColor: "default",
						textAlignment: "left",
					},
					content: [
						// ここにinlineコンテンツが入ります。例えばテキストノード等。
					],
				},
			];
			setInitialContent(init);
			return;
		}

		setInitialContent(JSON.parse(description) as PartialBlock[]);
	}, [description]);

	// Creates a new editor instance.
	const editor = useMemo(() => {
		if (initialContent === "loading") {
			return undefined;
		}
		return BlockNoteEditor.create({ initialContent: initialContent });
	}, [initialContent]);

	if (editor === undefined) {
		return "Loading content...";
	}

	// .bn-container[data-color-scheme="dark"]
	// data-color-scheme="dark"
	// Renders the editor instance using a React component.
	return (
		<BlockNoteView
			theme={theme.palette.mode === "dark" ? "dark" : "light"}
			editor={editor}
			onChange={() => handleOnChange(editor.document)}
		/>
	);
};
export default editor;

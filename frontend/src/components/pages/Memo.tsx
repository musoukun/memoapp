/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from "@mui/system";
import { IconButton, Snackbar, TextField, useTheme } from "@mui/material";
import {
	DeleteOutline,
	StarBorderOutlined,
	StarOutlined,
} from "@mui/icons-material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import memoApi from "../../api/memoApi";
import { useRecoilState } from "recoil";
import { memoStateAtom, memosStateAtom } from "../../atoms/memoAtoms";
import { AxiosResponse } from "axios";
import { DeleteMemoResponse, Memo } from "../../types/api.ts";
import EmojiPicker from "../common/EmojiPicker";
import { titleStateAtom } from "../../atoms/titleAtom.ts";
import {
	descriptionStateAtom,
	initialContentStateAtom,
} from "../../atoms/descriptionAtom.ts";
import { favoriteStateAtom } from "../../atoms/favoliteAtom.ts";

import ColorModeToggle from "../common/ColorModeToggle.tsx";
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/react";
import "@blocknote/react/style.css";

import mantine from "@mantine/core"; //必要！
import "@mantine/core/styles.css"; //必要！

const Memo = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const [icon, setIcon] = useState<string>("");
	const [memos, setMemos] = useRecoilState(memosStateAtom); // メモ一覧の状態を取得
	const [__memo, setMemo] = useRecoilState(memoStateAtom); // 現在選択中のメモの状態を取得

	const [title, setTitle] = useRecoilState(titleStateAtom); // メモのタイトルの状態を取得
	const [description, setDescription] = useRecoilState(descriptionStateAtom); // メモの本文の状態を取得

	const [favorite, setFavorite] = useRecoilState(favoriteStateAtom); // お気に入りの状態を取得

	// const [markdown, setMarkdown] = useState(description); // マークダウンの状態を取得

	const [debounceTime, setDebounceTime] = useState<number>(3500); // デバウンス時間を状態として保存
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null); // タイマーを保存するためのref

	// 更新メッセージと表示状態を管理するステートを追加
	const [updateMessage, setUpdateMessage] = useState<string>("");
	const [showMessage, setShowMessage] = useState<boolean>(false);

	// メモの初期内容を取得する処理
	const [initialContent, setInitialContent] = useRecoilState(
		initialContentStateAtom
	);

	// 更新メッセージを表示し、指定された時間後に非表示にする関数
	const displayUpdateMessage = () => {
		const now = new Date();
		const formattedDate = now.toLocaleString("ja-JP", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
		console.log(`更新しました (${formattedDate})`);
		setUpdateMessage(`更新しました (${formattedDate})`);
		setShowMessage(true);
		setTimeout(() => setShowMessage(false), 2300); // 3秒後にメッセージを非表示に
	};

	// メモの内容を取得する処理
	useEffect(() => {
		const getMemo = async () => {
			try {
				const res: AxiosResponse<Memo> = await memoApi.show(id!); // Add '!' to assert that id is not undefined
				setMemo(res.data); // 現在選択中のメモの状態を更新
				setTitle(res.data.title); // タイトルと本文の設定
				setDescription(res.data.description); // タイトルと本文の設定
				setIcon(res.data.icon); // アイコンの設定
				setFavorite(res.data.favorite); // お気に入りの設定

				return res.data;
			} catch (err) {
				console.error(err);
			}
		};

		const inittialBlockNote = async () => {
			// blocknoteの初期内容を設定
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
				console.log("init", init);
				setInitialContent(init);
				return;
			}
			console.log("description", description);
			setInitialContent(JSON.parse(description) as PartialBlock[]);
		};

		// getMemoの処理が終わるのを待ってからinittialBlockNoteを実行
		getMemo().then(() => {
			inittialBlockNote();
		});
	}, [id]); // idはuseParamsで取得していてURLのUUIDの変更を検知している

	// 新しいBlocknoteエディタインスタンスを作成
	const editor = useMemo(() => {
		if (initialContent === "loading") {
			return undefined;
		}
		return BlockNoteEditor.create({ initialContent: initialContent });
	}, [initialContent]);

	// メモの内容を更新する関数(デバウンス処理付き)
	// デバウンスとは、一定時間内に複数回のイベントが発生した場合、最後のイベントのみを実行する処理
	// タイトルと本文の内容とお気に入りの更新を統合した関数
	// タイトル、本文、お気に入りの更新があるたびに呼び出される
	useEffect(() => {
		const updateMemoContent = (
			newTitle: string,
			newDescription: string,
			favorite?: boolean
		) => {
			if (timer.current) clearTimeout(timer.current); // タイマーが存在する場合はクリア

			timer.current = setTimeout(async () => {
				// 一定時間後に実行
				try {
					const res: AxiosResponse<Memo> = await memoApi.update(id!, {
						// !マークはidがnullでないことをアサートする
						title: newTitle,
						description: newDescription,
						favorite: favorite,
					});
					console.log("Updated memo");
					console.log(res.data);
					displayUpdateMessage(); // メモ更新時にメッセージを表示
				} catch (err) {
					console.error(err);
				}
			}, debounceTime); //debounceTime は state で管理
		};
		updateMemoContent(title, description, favorite);
	}, [title, description, favorite]);

	//Noteに関連するイベント↓
	// newIcon は選択した絵文字
	const onIconChange = async (newIcon: string) => {
		let tmp = [...memos]; // Sidebarのメモ一覧のコピーを作成
		const index = tmp.findIndex((memo) => memo.id === id); // 選択中のメモのインデックスを取得
		tmp[index] = { ...tmp[index], icon: newIcon }; // 選択中のメモのアイコンを更新
		setIcon(newIcon); // アイコンの状態を更新
		setMemos(tmp); // メモ一覧の状態を更新

		// メモのアイコンを更新するAPIを呼び出す
		try {
			const res: AxiosResponse<Memo> = await memoApi.update(id!, {
				icon: newIcon, // 選択したアイコンをパラメータとして渡す
			});
			console.log(res);
		} catch (err) {
			console.error(err);
		}
	};

	// タイトルの変更イベント
	const handleTitleOnChange = (newTitle: string) => {
		setTitle(newTitle); // タイトルの状態を更新
	};

	// メモの内容の変更イベント
	const handleOnChangeBlockNote = (document: Block[]) => {
		const json = JSON.stringify(document);
		setDescription(json);
	};

	// メモの削除処理
	const deleteMemo = async () => {
		try {
			const deletedMemo: AxiosResponse<DeleteMemoResponse> =
				await memoApi.delete(id!);
			console.log("deletedMemo : ", deletedMemo);

			// filter 関数は、与えられた関数によって実装された条件に合致する要素だけを抽出して新しい配列を生成する
			const newMemos = memos.filter((e) => e.id !== id); // newMemosは削除されたメモを除いた配列
			// この配列でSidebarのメモ一覧を更新

			if (newMemos.length === 0) {
				// メモが削除された場合はリダイレクト
				navigate("/memo");
			} else {
				navigate(`/memo/${newMemos[0].id}`); // メモが削除された場合は、sidebar の最初のメモにリダイレクト
			}
			setMemos(newMemos); // メモ一覧の状態を更新
		} catch (err) {
			console.error(err);
		}
	};

	const handleFavoriteOnClick = async (newFavorite: boolean) => {
		setDebounceTime(1000); // デバウンス時間を短くする
		setFavorite(newFavorite); // お気に入りの状態を更新
	};

	const theme = useTheme();
	// editor が undefined の場合は、"Loading content..." を表示
	// blocknote の初期内容がロードされるまで表示される
	if (editor === undefined) {
		return "Loading content...";
	}

	return (
		<>
			<Box
				sx={{
					position: "absolute",
					top: 0,
					right: 0,
					padding: "10px",
					zIndex: 100,
				}}
			>
				<ColorModeToggle />
			</Box>
			<Box
				sx={{
					diplay: "flex",
					alignItems: "center",
					width: "100%",
					// backgroundColor: "red",
					padding: "10px 20px",
				}}
			>
				<IconButton onClick={() => handleFavoriteOnClick(!favorite)}>
					{favorite ? <StarOutlined /> : <StarBorderOutlined />}
				</IconButton>
				<IconButton color="error" onClick={deleteMemo}>
					<DeleteOutline />
				</IconButton>
			</Box>
			<Box sx={{ padding: "10px 25px" }}>
				<Box sx={{ padding: 1 }}>
					<EmojiPicker icon={icon} onChange={onIconChange} />
				</Box>
				<TextField
					value={title}
					variant="outlined"
					fullWidth
					placeholder="無題"
					onChange={(e) => handleTitleOnChange(e.target.value)}
					sx={{
						boxSizing: "content-box",
						".MuiOutlinedInput-notchedOutline": {
							border: "none",
						},
						".MuiOutlinedInput-root": {
							fontSize: "2rem",
							fontWeight: 700,
						},
						padding: 0,
					}}
				></TextField>
			</Box>
			<Box sx={{ padding: "10px 1px" }}>
				<BlockNoteView
					theme={theme.palette.mode === "dark" ? "dark" : "light"}
					editor={editor}
					onChange={() => handleOnChangeBlockNote(editor.document)}
				/>
			</Box>
			{/* 保存タイミング表示用 */}
			<Snackbar
				open={showMessage}
				message={updateMessage}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				sx={{
					".MuiSnackbarContent-root": {
						backgroundColor: "rgba(0, 0, 0, 0.8)", // 背景色
						color: "gray", // 文字色
						fontSize: "1rem", // 文字サイズ
						border: "none",
					},
				}}
			/>
			{/* <MarkdownViewer markdownText={description}></MarkdownViewer>  */}
		</>
	);
};

export default Memo;

/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from "@mui/system";
import { IconButton, Snackbar, TextField } from "@mui/material";
import {
	DeleteOutline,
	StarBorderOutlined,
	StarOutlined,
} from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import memoApi from "../../api/memoApi";
import { useRecoilState } from "recoil";
import {
	createMemoflgAtom,
	memoStateAtom,
	memosStateAtom,
	updateMemoflgAtom,
} from "../../atoms/memoAtoms";
import { AxiosResponse } from "axios";
import { DeleteMemoResponse, Memo } from "../../types/api.ts";
import EmojiPicker from "../common/EmojiPicker";
import { titleStateAtom } from "../../atoms/titleAtom.ts";
import { descriptionStateAtom } from "../../atoms/descriptionAtom.ts";
import { favoriteStateAtom } from "../../atoms/favoliteAtom.ts";
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { MarkdownLineEditor } from "../common/MarkdownLineEditor.tsx";

const Memo = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const [icon, setIcon] = useState<string>("");
	const [memos, setMemos] = useRecoilState(memosStateAtom); // メモ一覧の状態を取得
	const [memo, setMemo] = useRecoilState(memoStateAtom); // 現在選択中のメモの状態を取得

	const [title, setTitle] = useRecoilState(titleStateAtom); // メモのタイトルの状態を取得
	const [description, setDescription] = useRecoilState(descriptionStateAtom); // メモの本文の状態を取得
	const [favorite, setFavorite] = useRecoilState(favoriteStateAtom); // お気に入りの状態を取得

	// const [markdown, setMarkdown] = useState(description); // マークダウンの状態を取得

	const [updateMemoflg, setUpdateMemoflg] = useRecoilState(updateMemoflgAtom); // メモ更新フラグの状態を取得
	const [deleteMemoflg, setDeleteMemoflg] = useRecoilState(createMemoflgAtom); // メモ削除フラグの状態を取得

	const [debounceTime, setDebounceTime] = useState<number>(700); // デバウンス時間を状態として保存
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null); // タイマーを保存するためのref

	// 更新メッセージと表示状態を管理するステートを追加
	const [updateMessage, setUpdateMessage] = useState<string>("");
	const [showMessage, setShowMessage] = useState<boolean>(false);

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
		setTimeout(() => setShowMessage(false), 3000); // 3秒後にメッセージを非表示に
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
			} catch (err) {
				console.error(err);
			}
		};
		getMemo();
	}, [id]);

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
					setMemo(res.data);
					setUpdateMemoflg(true); // メモ更新フラグを更新
					displayUpdateMessage(); // メモ更新時にメッセージを表示
				} catch (err) {
					console.error(err);
				}
			}, debounceTime); //debounceTime は state で管理
		};
		updateMemoContent(title, description, favorite);
	}, [title, description, favorite]);

	// メモの削除処理
	const deleteMemo = async () => {
		try {
			const deletedMemo: AxiosResponse<DeleteMemoResponse> =
				await memoApi.delete(id!);
			console.log("deletedMemo : ", deletedMemo);

			// filter 関数は、与えられた関数によって実装された条件に合致する要素だけを抽出して新しい配列を生成する
			const newMemos = memos.filter((e) => e.id !== id); // newMemosは削除されたメモを除いた配列

			if (newMemos.length === 0) {
				// メモが削除された場合はリダイレクト
				navigate("/memo");
			} else {
				navigate(`/memo/${newMemos[0].id}`); // メモが削除された場合は、sidebar の最初のメモにリダイレクト
			}
			setMemos(newMemos); // メモ一覧の状態を更新
			setDeleteMemoflg(true); // メモ削除フラグを更新
		} catch (err) {
			console.error(err);
		}
	};

	// newIcon は選択した絵文字
	const onIconChange = async (newIcon: string) => {
		let tmp = [...memos]; // メモ一覧のコピーを作成
		const index = tmp.findIndex((memo) => memo.id === id); // 選択中のメモのインデックスを取得
		tmp[index] = { ...tmp[index], icon: newIcon }; // 選択中のメモのアイコンを更新
		setIcon(newIcon); // アイコンの状態を更新
		setMemos(tmp); // メモ一覧の状態を更新

		// メモのアイコンを更新するAPIを呼び出す
		try {
			const res: AxiosResponse<Memo> = await memoApi.update(id!, {
				icon: newIcon, // 選択したアイコンをパラメータとして渡す
			});
			// console.log(res);
		} catch (err) {
			console.error(err);
		}
	};

	const [items, setItems] = useState(["item-1", "item-2", "item-3"]);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor)
	);

	function handleDragEnd(event: any) {
		const { active, over } = event;

		if (active.id !== over.id) {
			setItems((items) => {
				const oldIndex = items.indexOf(active.id);
				const newIndex = items.indexOf(over.id);
				return arrayMove(items, oldIndex, newIndex);
			});
		}
	}

	return (
		<>
			<Box
				sx={{
					diplay: "flex",
					alignItems: "center",
					width: "100%",
					// backgroundColor: "red",
				}}
			>
				<IconButton onClick={() => setFavorite(!favorite)}>
					{favorite ? <StarOutlined /> : <StarBorderOutlined />}
				</IconButton>
				<IconButton color="error" onClick={deleteMemo}>
					<DeleteOutline />
				</IconButton>
			</Box>
			<Box sx={{ padding: "10px 50px" }}>
				<Box>
					<EmojiPicker icon={icon} onChange={onIconChange} />
					<TextField
						value={title}
						variant="outlined"
						fullWidth
						placeholder="無題"
						onChange={(e) => setTitle(e.target.value)}
						sx={{
							".MuiOutlinedInput-input": { padding: 0 },
							".MuiOutlinedInput-notchedOutline": {
								border: "none",
							},
							".MuiOutlinedInput-root": {
								fontSize: "2rem",
								fontWeight: 700,
							},
						}}
					></TextField>
					<TextField
						onChange={(e) => setDescription(e.target.value)}
						value={description}
						variant="outlined"
						fullWidth
						multiline
						placeholder="追加"
						sx={{
							".MuiOutlinedInput-input": { padding: 0 },
							".MuiOutlinedInput-notchedOutline": {
								border: "none",
							},
							".MuiOutlinedInput-root": {
								fontSize: "1rem",
								fontWeight: 700,
							},
						}}
					/>
				</Box>
			</Box>
			<MarkdownLineEditor />
			{/* 保存タイミング表示用 */}
			<Snackbar
				open={showMessage}
				message={updateMessage}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				sx={{
					".MuiSnackbarContent-root": {
						backgroundColor: "rgba(255,255,255,0.9)", // 薄い白っぽい背景
						color: "black", // 文字色
						fontSize: "0.875rem", // 文字サイズ
					},
				}}
			/>
			{/* <MarkdownViewer markdownText={description}></MarkdownViewer>  */}
		</>
	);
};

export default Memo;

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from "@mui/system";
import { IconButton, Snackbar, TextField } from "@mui/material";
import { DeleteOutline, StarBorderOutlined } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import memoApi from "../../api/memoApi";
import { useRecoilState } from "recoil";
import {
	createMemoflgAtom,
	updateMemoflgAtom,
} from "../../state/atoms/memoAtoms";

const Memo = () => {
	const { id } = useParams();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [debounceTime, setDebounceTime] = useState(2000); // デバウンス時間を状態として保存
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null); // タイマーを保存するためのref

	// 更新メッセージと表示状態を管理するステートを追加
	const [updateMessage, setUpdateMessage] = useState("");
	const [showMessage, setShowMessage] = useState(false);

	//メモがupdateされたことを確認するState
	const [updateMemoflg, setUpdateMemoflg] = useRecoilState(updateMemoflgAtom);

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

	// タイトル変更時のハンドラー
	const updateTitle = (e: { target: { value: any } }) => {
		const newTitle = e.target.value;
		setTitle(newTitle);
		updateMemoContent(newTitle, description);
	};

	// 説明変更時のハンドラー
	const updateDescription = (e: { target: { value: any } }) => {
		const newDescription = e.target.value;
		setDescription(newDescription);
		updateMemoContent(title, newDescription);
	};

	useEffect(() => {
		const getMemo = async () => {
			try {
				const res = await memoApi.show(id!); // Add '!' to assert that id is not undefined
				console.log(res.data);
				setTitle(res.data.title);
				setDescription(res.data.description);
			} catch (err) {
				console.error(err);
			}
		};
		getMemo();
	}, [id]);

	// メモの内容を更新する関数(デバウンス処理付き)
	// デバウンスとは、一定時間内に複数回のイベントが発生した場合、最後のイベントのみを実行する処理

	// タイトルと本文の内容の更新を統合した関数
	const updateMemoContent = (newTitle: string, newDescription: string) => {
		if (timer.current) clearTimeout(timer.current); // タイマーが存在する場合はクリア

		timer.current = setTimeout(async () => {
			// 一定時間後に実行
			try {
				await memoApi.update(id!, {
					// !マークはidがnullでないことをアサートする
					title: newTitle,
					description: newDescription,
				});
				console.log("Updated memo");
				displayUpdateMessage(); // メモ更新時にメッセージを表示
				setUpdateMemoflg(true); // メモが更新されたことを確認したらフラグをtrueにする
			} catch (err) {
				console.error(err);
			}
		}, debounceTime); //debounceTime は state で管理
	};

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
				<IconButton>
					<StarBorderOutlined />
				</IconButton>
				<IconButton color="error">
					<DeleteOutline />
				</IconButton>
			</Box>
			<Box sx={{ padding: "10px 50px" }}>
				<TextField
					value={title}
					variant="outlined"
					fullWidth
					placeholder="無題"
					onChange={updateTitle}
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
					onChange={updateDescription}
					value={description}
					variant="outlined"
					fullWidth
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
		</>
	);
};

export default Memo;

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Box,
	Drawer,
	List,
	ListItemButton,
	Typography,
	useTheme,
} from "@mui/material";
import { AddBoxOutlined, Favorite, LogoutOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import assets from "../../assets";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { userStateAtom } from "../../atoms/userAtoms";
import { Link } from "react-router-dom";
import memoApi from "../../api/memoApi";
import {
	createMemoflgAtom,
	memosStateAtom,
	updateMemoflgAtom,
} from "../../atoms/memoAtoms";
import { Memo } from "../../types/api";
import { descriptionStateAtom } from "../../atoms/descriptionAtom";
import { favoriteStateAtom } from "../../atoms/favoliteAtom";
import { titleStateAtom } from "../../atoms/titleAtom";
import { AxiosResponse } from "axios";

const Sidebar = () => {
	const theme = useTheme();
	const [activeIndex, setActiveIndex] = useState(0); // アクティブなメモのインデックスを保持するステート
	const navigate = useNavigate(); // ルーティング用の関数

	const user = useRecoilValue(userStateAtom); // ユーザー情報の状態を取得
	const [memos, setMemos] = useRecoilState(memosStateAtom); // メモ一覧の状態を取得

	const [createMemoflg, setCreateMemoflg] = useRecoilState(createMemoflgAtom); // メモ作成フラグの状態を取得
	const [updateMemoflg, setUpdateMemoflg] = useRecoilState(updateMemoflgAtom); // メモ更新フラグの状態を取得
	const [deleteMemoflg, setDeleteMemoflg] = useRecoilState(createMemoflgAtom); // メモ削除フラグの状態を取得

	const { id } = useParams(); // メモのIDを取得 useParamsはパラメータを取得するためのフック

	const logout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	const addMemo = async () => {
		try {
			// メモの作成処理
			const res = await memoApi.create();
			console.log(res.data);

			// メモ一覧に新しく作成したメモを追加
			const newMemos = [...memos, res.data];
			setMemos(newMemos);

			// 作成したメモのページに遷移
			navigate(`/memo/${res.data.id}`);
		} catch (err: any) {
			alert(err.status + ": " + err.statusText);
		}
	};

	useEffect(() => {
		const getMemos = async () => {
			// メモの取得処理
			try {
				const res: AxiosResponse<Memo[]> = await memoApi.getAll();
				setMemos(res.data);
				setDeleteMemoflg(false);
				setUpdateMemoflg(false);
				setCreateMemoflg(false);
			} catch (err: any) {
				alert(err.status + ": " + err.statusText);
			}
		};
		getMemos();
	}, [deleteMemoflg, createMemoflg, updateMemoflg]);

	useEffect(() => {
		// メモのIDが変更されたときにアクティブなメモのインデックスを更新
		const index = memos.findIndex((memo: any) => memo.id === id);
		setActiveIndex(index);
	}, [navigate, updateMemoflg, createMemoflg, deleteMemoflg]);

	return (
		<>
			<Drawer
				container={window.document.body}
				variant="permanent"
				open={true}
				sx={{
					width: 250,
					height: "100vh",
					bgcolor: theme.palette.background.default, // テーマに応じて背景色を設定
				}}
			>
				<List
					sx={{
						width: 250,
						height: "100vh",
						bgcolor: theme.palette.background.default, // テーマに応じて背景色を設定
					}}
				>
					<ListItemButton component={Link} to="/">
						<Box
							sx={{
								width: "100%",
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<Typography variant="body2" fontWeight="700">
								{user.username}
							</Typography>
							<IconButton onClick={logout}>
								<LogoutOutlined />
							</IconButton>
						</Box>
					</ListItemButton>
					<Box sx={{ paddingTop: "10px" }}></Box>
					<ListItemButton>
						<Box
							sx={{
								width: "100%",
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<Typography variant="body2" fontWeight="700">
								お気に入り
							</Typography>
						</Box>
					</ListItemButton>
					{memos
						.filter((item: Memo) => item.favorite)
						.map((item: Memo, index: number) => (
							<ListItemButton
								sx={{ pl: "20px" }}
								component={Link}
								to={`/memo/${item.id}`}
								key={item.id}
								selected={activeIndex === index}
							>
								<Typography>
									{item.icon} {item.title}
								</Typography>
							</ListItemButton>
						))}
					<Box sx={{ paddingTop: "10px" }}></Box>
					<ListItemButton>
						<Box
							sx={{
								width: "100%",
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<Typography variant="body2" fontWeight="700">
								プライベート
							</Typography>
							<IconButton onClick={() => addMemo()}>
								<AddBoxOutlined fontSize="small" />
							</IconButton>
						</Box>
					</ListItemButton>
					{memos.map((item: any, index: any) => (
						<ListItemButton
							sx={{ pl: "20px" }}
							component={Link}
							to={`/memo/${item.id}`}
							key={item.id}
							selected={activeIndex === index}
							// selected={true}
						>
							<Typography>
								{item.icon} {item.title}
							</Typography>
						</ListItemButton>
					))}
				</List>
			</Drawer>
		</>
	);
};

export default Sidebar;

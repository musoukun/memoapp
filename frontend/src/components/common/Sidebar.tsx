/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Drawer, List, ListItemButton, Typography } from "@mui/material";
import { AddBoxOutlined, LogoutOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import assets from "../../assets";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { userStateAtom } from "../../state/atoms/userAtoms";
import { Link } from "react-router-dom";
import memoApi from "../../api/memoApi";
import { memosStateAtom } from "../../state/atoms/memoAtoms";

const Sidebar = () => {
	const [activeIndex, setActiveIndex] = useState(0); // アクティブなメモのインデックスを保持するステート
	const navigate = useNavigate(); // ルーティング用の関数
	const user = useRecoilValue(userStateAtom);
	const [memos, setMemos] = useRecoilState(memosStateAtom);
	const { id } = useParams(); // メモのIDを取得 useParamsはパラメータを取得するためのフック

	const logout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	useEffect(() => {
		const getMemos = async () => {
			// メモの取得処理
			try {
				const res = await memoApi.getAll();
				console.log(res.data);
				setMemos(res.data);
			} catch (err: any) {
				alert(err.status + ": " + err.statusText);
			}
		};
		getMemos();
	}, [setMemos]);

	useEffect(() => {
		const activeIndex = memos.findIndex((item: any) => item.id === id);
		setActiveIndex(activeIndex);
	}, [navigate]);

	return (
		<Drawer
			container={window.document.body}
			variant="permanent"
			open={true}
			sx={{ width: 250, height: "100vh" }}
		>
			<List
				sx={{
					width: 250,
					height: "100vh",
					backgroundColor: assets.colors.dark, // ブラウザのダークモードに合わせて自動で変更したい
				}}
			>
				<ListItemButton
					component={Link}
					to="/memo/d1a54b80-9823-4090-aaa1-deb59df09be5"
				>
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
						<IconButton>
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
	);
};

export default Sidebar;

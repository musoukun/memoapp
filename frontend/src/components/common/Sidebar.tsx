/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Drawer, List, ListItemButton, Typography } from "@mui/material";
import { AddBoxOutlined, LogoutOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import assets from "../../assets";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userStateAtom } from "../../state/atoms/userAtoms";

const Sidebar = () => {
	const navigate = useNavigate(); // ルーティング用の関数
	const user = useRecoilValue(userStateAtom);

	const logout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

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
				<ListItemButton>
					<Typography>📝仮置きのメモ</Typography>
				</ListItemButton>
			</List>
		</Drawer>
	);
};

export default Sidebar;

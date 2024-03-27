/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Container } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import notionLogo from "../../assets/notion-1-1.svg";
import authUtils from "../../utils/authUtil";
import SideBar from "../common/Sidebar";
import { userStateAtom } from "../../state/atoms/userAtoms";
import { useRecoilState } from "recoil";

const AppLayout = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useRecoilState(userStateAtom);

	useEffect(() => {
		//JWTを持ってるのか確認する。
		const checkAuth = async () => {
			// 認証チェック
			const isUser = await authUtils.isAuthenticated();
			if (!isUser) {
				navigate("/login"); // 認証済みの場合はホームにリダイレクト
			} else {
				//ユーザーの保存
				setUser(isUser);
				setLoading(false);
			}
		};
		checkAuth();
	}, [navigate]);

	return (
		<div>
			<Box sx={{ display: "flex" }}>
				<SideBar />
				<Box sx={{ flexGrow: 1, p: 1, width: "max-content" }}>
					<Outlet />
				</Box>
			</Box>
		</div>
	);
};
export default AppLayout;

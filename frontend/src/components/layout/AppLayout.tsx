/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import authUtils from "../../utils/authUtil";
import SideBar from "../common/Sidebar";
import { userStateAtom } from "../../atoms/userAtoms";
import Loading from "../common/Loading";
import { useRecoilState } from "recoil";
import "../../App.css";

const AppLayout = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [__user, setUser] = useRecoilState(userStateAtom);

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
		// updateRootStyle();
	}, [navigate]);

	return loading ? (
		<>
			<Loading fullHeight />
		</>
	) : (
		<div id="mainRoot" className="mainRoot">
			<Box sx={{ display: "flex" }}>
				<SideBar />
				<Box
					sx={{
						flexGrow: 1,
						p: 1,
						width: "max-content",
					}}
				>
					<Outlet />
				</Box>
			</Box>
		</div>
	);
};
export default AppLayout;

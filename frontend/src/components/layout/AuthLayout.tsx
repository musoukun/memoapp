/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Container, ThemeProvider } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import notionLogo from "../../assets/notion-1-1.svg";
import authUtils from "../../utils/authUtil";
import { userStateAtom } from "../../atoms/userAtoms";
import { useRecoilState } from "recoil";
import "../../App.css";

const AuthLayout = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useRecoilState(userStateAtom);

	useEffect(() => {
		//JWTを持ってるのか確認する。
		const checkAuth = async () => {
			// 認証チェック
			const isAuthenticated = await authUtils.isAuthenticated();
			if (!isAuthenticated) {
				setLoading(false);
			} else {
				setUser(isAuthenticated);
				navigate("/");
			}
		};
		checkAuth();
	}, [navigate]);

	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 8,
					display: "flex",
					alignItems: "center",
					flexDirection: "column",
				}}
			>
				<img
					src={notionLogo}
					alt=""
					style={{ width: 100, height: 100, marginBottom: 3 }}
				/>
				Notionクローン開発
			</Box>
			<Outlet />
		</Container>
	);
};
export default AuthLayout;

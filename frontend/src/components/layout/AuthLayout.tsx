/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import notionLogo from "../../assets/markdown.svg";
import authUtils from "../../utils/authUtil";
import { userStateAtom } from "../../atoms/userAtoms";
import { useRecoilState } from "recoil";
import "../../App.css";

const AuthLayout = () => {
	const navigate = useNavigate();
	const [__loading, setLoading] = useState(true);
	const [__user, setUser] = useRecoilState(userStateAtom);

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
		<div className="container mx-auto max-w-md px-4">
			<div className="mt-20 flex flex-col items-center">
				<img
					src={notionLogo}
					alt="Markdown Editor Logo"
					className="w-24 h-24 mb-3"
				/>
				<h1 className="text-xl font-semibold mb-6">
					Markdownエディタ開発＠BlockNote
				</h1>
				<Outlet />
			</div>
		</div>
	);
};
export default AuthLayout;

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import notionLogo from "../../assets/markdown.svg";

import "../../App.css";

const AuthLayout = () => {
	const navigate = useNavigate();
	const user = localStorage.getItem("user");

	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, [user, navigate]);

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

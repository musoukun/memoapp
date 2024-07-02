/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import authApi from "../../api/authApi";

const Login = () => {
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [usernameErrText, setUsernameErrText] = useState("");
	const [passwordErrText, setPasswordErrText] = useState("");

	const handleSubmit = async (element: React.FormEvent<HTMLFormElement>) => {
		element.preventDefault();
		setUsernameErrText("");
		setPasswordErrText("");

		const data = new FormData(element.currentTarget);
		const username = data.get("username") as string;
		const password = data.get("password") as string;

		let error = false;

		if (!username) {
			error = true;
			setUsernameErrText("名前を入力してください。");
		}
		if (!password) {
			error = true;
			setPasswordErrText("パスワードを入力してください。");
		}

		if (error) return;

		setLoading(true);

		try {
			const res = await authApi.login({
				username,
				password,
			});
			if (res.status === 201) {
				localStorage.setItem("token", res.data.token);
				setLoading(false);
				navigate("/");
			}
		} catch (err: any) {
			// バックエンドから返されたエラーメッセージの処理
			setLoading(false);
			const errors = await Promise.resolve(err.data);
			console.log(errors);
			errors.forEach((e: any) => {
				if (e.errors) {
					if (e.path === "username") {
						setUsernameErrText(e.msg); // ユーザー名エラー
					}
					if (e.path === "password") {
						setPasswordErrText(e.msg); // パスワードエラー
					}
					// 確認パスワードのエラーはバックエンドでチェックしないのでフロントエンドのロジックに依存
				}
			});
		}
	};

	return (
		<>
			<Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
				<TextField
					label="Username"
					fullWidth
					margin="normal"
					name="username"
					required
					disabled={loading}
					error={usernameErrText !== ""}
					helperText={usernameErrText}
				/>
				<TextField
					label="Password"
					fullWidth
					type="password"
					margin="normal"
					name="password"
					required
					disabled={loading}
					error={passwordErrText !== ""}
					helperText={passwordErrText}
				/>
				<LoadingButton
					sx={{ mt: 3, mb: 2 }}
					fullWidth
					type="submit"
					color="primary"
					variant="outlined"
					loading={loading}
				>
					Login
				</LoadingButton>
				<Button
					component={Link}
					to="/register"
					sx={{ textTransform: "none" }}
				>
					アカウントを持っていませんか？新規登録
				</Button>
			</Box>
		</>
	);
};

export default Login;

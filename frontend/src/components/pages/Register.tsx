/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import authApi from "../../api/authApi";

const Register = () => {
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [usernameErrText, setUsernameErrText] = useState("");
	const [passwordErrText, setPasswordErrText] = useState("");
	const [confirmPasswordErrText, setConfirmPasswordErrText] = useState("");

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setUsernameErrText("");
		setPasswordErrText("");
		setConfirmPasswordErrText("");

		const data = new FormData(e.target);
		const username = data.get("username") as string;
		const password = data.get("password") as string;
		const passwordConfirmation = data.get("confirmpassword") as string;

		let error = false;

		if (!username) {
			error = true;
			setUsernameErrText("名前を入力してください。");
		}
		if (!password) {
			error = true;
			setPasswordErrText("パスワードを入力してください。");
		}
		if (password !== passwordConfirmation) {
			error = true;
			setConfirmPasswordErrText("パスワードが一致しません。");
		}

		if (error) return;

		setLoading(true);

		try {
			const res = await authApi.register({
				user: {
					username,
					password,
					password_confirmation: passwordConfirmation,
				},
			});
			if (res.status === 201) {
				localStorage.setItem("token", res.data.token);
				setLoading(false);
				navigate("/");
			}
		} catch (err: any) {
			setLoading(false);
			// バックエンドから返されたエラーメッセージの処理
			if (err.data.errors) {
				const errors = err.data.errors;
				if (errors.username) {
					setUsernameErrText(errors.username.join(", ")); // ユーザー名エラー
				}
				if (errors.password) {
					setPasswordErrText(errors.password.join(", ")); // パスワードエラー
				}
				// 確認パスワードのエラーはバックエンドでチェックしないのでフロントエンドのロジックに依存
			}
		}
	};

	return (
		<>
			<Box component="form" onSubmit={handleSubmit}>
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
				<TextField
					label="ConfirmPassword"
					margin="normal"
					fullWidth
					name="confirmpassword"
					required
					disabled={loading}
					error={confirmPasswordErrText !== ""}
					helperText={confirmPasswordErrText}
				/>
				<LoadingButton
					sx={{ mt: 3, mb: 2 }}
					fullWidth
					type="submit"
					color="primary"
					variant="outlined"
					loading={loading}
				>
					Create Account
				</LoadingButton>
				<Button
					component={Link}
					to="/login"
					sx={{ textTransform: "none" }}
				>
					すでにアカウントをもっている方はこちら
				</Button>
			</Box>
		</>
	);
};

export default Register;

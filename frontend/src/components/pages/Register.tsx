/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import authApi from "../../api/authApi";

type ErrorResponse = {
	type: string;
	value: string;
	msg: string;
	path: string;
	location: string;
};

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
				username,
				password,
				confirmPassword: passwordConfirmation, // Declare or initialize the value of 'confirmPassword' property
			});
			setLoading(false);
			localStorage.setItem("token", res.data.token);
			navigate("/");
		} catch (err: any) {
			const errors: Array<ErrorResponse> = err.data.errors;
			console.log(err.data.errors);

			errors.forEach((e: ErrorResponse) => {
				console.log(e);
				if (e.path === "username") {
					setUsernameErrText(e.msg);
				}
				if (e.path === "password") {
					setPasswordErrText(e.msg);
				}
				if (e.path === "confirmPassword") {
					setConfirmPasswordErrText(e.msg);
				}
			});
			setLoading(false);
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

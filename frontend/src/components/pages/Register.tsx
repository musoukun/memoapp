/* eslint-disable @typescript-eslint/no-unused-vars */
import LoadingButton from "../common/LoadingButton";
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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setUsernameErrText("");
		setPasswordErrText("");
		setConfirmPasswordErrText("");

		const data = new FormData(e.currentTarget);
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
				confirmPassword: passwordConfirmation,
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
		<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md ">
			<form className="space-y-6 " onSubmit={handleSubmit}>
				<div>
					<label
						htmlFor="username"
						className="block text-sm font-medium text-gray-700"
					>
						Username
					</label>
					<div className="mt-1">
						<input
							id="username"
							name="username"
							type="text"
							required
							className={`appearance-none block w-full px-3 py-2 border ${
								usernameErrText
									? "border-red-300"
									: "border-gray-300"
							} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
							disabled={loading}
						/>
					</div>
					{usernameErrText && (
						<p className="mt-2 text-sm text-red-600">
							{usernameErrText}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700"
					>
						Password
					</label>
					<div className="mt-1">
						<input
							id="password"
							name="password"
							type="password"
							required
							className={`appearance-none block w-full px-3 py-2 border ${
								passwordErrText
									? "border-red-300"
									: "border-gray-300"
							} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
							disabled={loading}
						/>
					</div>
					{passwordErrText && (
						<p className="mt-2 text-sm text-red-600">
							{passwordErrText}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="confirmpassword"
						className="block text-sm font-medium text-gray-700"
					>
						Confirm Password
					</label>
					<div className="mt-1">
						<input
							id="confirmpassword"
							name="confirmpassword"
							type="password"
							required
							className={`appearance-none block w-full px-3 py-2 border ${
								confirmPasswordErrText
									? "border-red-300"
									: "border-gray-300"
							} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
							disabled={loading}
						/>
					</div>
					{confirmPasswordErrText && (
						<p className="mt-2 text-sm text-red-600">
							{confirmPasswordErrText}
						</p>
					)}
				</div>

				<div>
					<LoadingButton isLoading={loading} onClick={() => {}}>
						Create Account
					</LoadingButton>
				</div>
			</form>

			<div className="mt-6">
				<Link
					to="/login"
					className="text-sm font-medium text-blue-600 hover:text-blue-500"
				>
					すでにアカウントをもっている方はこちら
				</Link>
			</div>
		</div>
	);
};

export default Register;

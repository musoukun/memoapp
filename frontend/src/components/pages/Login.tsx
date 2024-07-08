import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import LoadingButton from "../common/LoadingButton";

const Login = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [usernameErrText, setUsernameErrText] = useState<string>("");
	const [passwordErrText, setPasswordErrText] = useState<string>("");
	const [generalErrText, setGeneralErrText] = useState<string>("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setUsernameErrText("");
		setPasswordErrText("");
		setGeneralErrText("");

		const data = new FormData(e.currentTarget);
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
				localStorage.setItem("user", JSON.stringify(res.data.user));
				navigate("/");
			}
		} catch (err: any) {
			// errorが配列かどうかをチェック
			setLoading(false);
			if (err.data.errors && Array.isArray(err.data.errors)) {
				const errors = err.data.errors;
				errors.forEach((e: { path: string; msg: string }) => {
					if (e.path === "username") {
						setUsernameErrText(e.msg);
					}
					if (e.path === "password") {
						setPasswordErrText(e.msg);
					}
				});
			} else {
				setGeneralErrText(
					`"予期しないエラーが発生しました。もう一度お試しください。${err.data}"`
				);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-white dark:bg-gray-800 text-black dark:text-white">
			{generalErrText && (
				<div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
					{generalErrText}
				</div>
			)}
			<form className="space-y-6" onSubmit={handleSubmit}>
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
						/>
					</div>
					{passwordErrText && (
						<p className="mt-2 text-sm text-red-600">
							{passwordErrText}
						</p>
					)}
				</div>

				<div>
					<LoadingButton isLoading={loading} onClick={() => {}}>
						Login
					</LoadingButton>
				</div>
			</form>

			<div className="mt-6">
				<Link
					to="/register"
					className="text-sm font-medium text-blue-600 hover:text-blue-500"
				>
					アカウントを持っていませんか？新規登録
				</Link>
			</div>
		</div>
	);
};

export default Login;

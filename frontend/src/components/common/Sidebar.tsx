/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { userStateAtom } from "../../atoms/userAtoms";
import memoApi from "../../api/memoApi";
import {
	favoriteMemosSelector,
	memoStateAtom,
	memosStateAtom,
	sortedMemosSelector,
} from "../../atoms/memoAtoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
	const [activeIndex] = useState(0); // アクティブなメモのインデックスを保持するステート
	const navigate = useNavigate(); // ルーティング用の関数

	const user = useRecoilValue(userStateAtom); // ユーザー情報の状態を取得
	const [memos, setMemos] = useRecoilState(memosStateAtom); // メモ一覧の状態を取得

	const sortedMemos = useRecoilValue(sortedMemosSelector);
	const favoriteMemos = useRecoilValue(favoriteMemosSelector);

	// ログアウト処理関連のステートと関数
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const resetMemos = useResetRecoilState(memosStateAtom);
	const resetMemo = useResetRecoilState(memoStateAtom);
	const resetUser = useResetRecoilState(userStateAtom);
	const location = useLocation();

	useEffect(() => {
		const fetchMemos = async () => {
			try {
				const response = await memoApi.getAll();
				setMemos(response.data);
			} catch (error) {
				console.error("Failed to fetch memos:", error);
			}
		};

		fetchMemos();
	}, []);

	const logout = async () => {
		if (isLoggingOut) return; // 既にログアウト処理中なら何もしない

		setIsLoggingOut(true);
		try {
			// ログアウト処理
			// ローカルストレージからトークンを削除
			localStorage.removeItem("token");

			// ログアウト時に各種状態をリセット
			resetMemos();
			resetMemo();
			resetUser();

			navigate("/login");
		} catch (error) {
			console.error("Logout failed:", error);
		} finally {
			setIsLoggingOut(false);
		}
	};

	// ログインしていない場合はログインページにリダイレクト
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token && location.pathname !== "/login") {
			navigate("/login");
		}
	}, [location, navigate]);

	const addMemo = async () => {
		try {
			// メモの作成処理
			const res = await memoApi.create();
			// メモ一覧に新しく作成したメモを追加
			const newMemos = [...memos, res.data];
			setMemos(newMemos);
			navigate(`/memo/${res.data.id}`);
		} catch (err: any) {
			alert(err.status + ": " + err.statusText);
		}
	};

	return (
		<div className="w-[250px] h-screen bg-white dark:bg-gray-800 flex flex-col overflow-hidden">
			<div className="flex-shrink-0">
				<div className="flex items-center justify-between p-4">
					<span className="text-sm font-bold text-black dark:text-white">
						{user.username}
					</span>
					<button
						className="text-gray-600 dark:text-gray-400"
						onClick={logout}
					>
						<FontAwesomeIcon icon={faSignOutAlt} />
					</button>
				</div>
			</div>
			<div className="flex-grow overflow-y-auto">
				<ul>
					<li className="mt-2">
						<div className="flex items-center justify-between w-full p-4">
							<span className="text-sm font-bold text-black dark:text-white">
								お気に入り
							</span>
						</div>
					</li>
					{favoriteMemos
						.filter((item) => item.favorite)
						.map((item, index) => {
							const isSelected = activeIndex === index; // Replace with logic to determine selected index
							const itemClasses = `flex items-center p-4 text-black dark:text-white ${isSelected ? "bg-gray-200 dark:bg-gray-700" : ""}`;
							return (
								<li key={item.id} className="pl-8">
									<Link
										to={`/memo/${item.id}`}
										className={itemClasses}
									>
										{item.icon} {item.title}
									</Link>
								</li>
							);
						})}
					<li className="mt-2">
						<div className="flex items-center justify-between w-full p-4">
							<span className="text-sm font-bold text-black dark:text-white">
								プライベート
							</span>
							<button
								className="text-gray-600 dark:text-gray-400"
								onClick={addMemo}
							>
								<FontAwesomeIcon icon={faPlusSquare} />
							</button>
						</div>
					</li>
					{sortedMemos.map((item) => (
						<li key={item.id} className="pl-8">
							<Link
								to={`/memo/${item.id}`}
								className="flex items-center p-4 text-black dark:text-white"
							>
								{item.icon} {item.title}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Sidebar;

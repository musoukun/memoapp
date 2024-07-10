import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./components/layout/AuthLayout";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import AppLayout from "./components/layout/AppLayout";
import Home from "./components/pages/Home";
import Note from "./components/pages/Note";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authLoadingAtom, userStateAtom } from "./atoms/userAtoms";
import authUtils from "./utils/authUtil";
import Kanban from "./components/pages/Kanban";
import { KanbanBoard } from "./components/Kanban/KanbanBoard";

function App() {
	const setUser = useSetRecoilState(userStateAtom);
	const setAuthLoading = useSetRecoilState(authLoadingAtom);
	const authLoading = useRecoilValue(authLoadingAtom);

	useEffect(() => {
		if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, []);

	useEffect(() => {
		const checkAuth = async () => {
			setAuthLoading(true);
			const isUser = await authUtils.isAuthenticated();
			if (isUser) {
				setUser(isUser);
			}
			setAuthLoading(false);
		};
		checkAuth();
	}, [setUser, setAuthLoading]);

	if (authLoading) {
		return <div>Loading...</div>;
	}

	const recentAccess = [
		{ name: "無題", time: "9分前" },
		{ name: "データ取込", time: "2022年5月26日" },
		{ name: "テスト", time: "2022年4月21日" },
		{ name: "開発・ツール関連打ち合わせ1", time: "2023年9月5日" },
		{ name: "テストタイトル2", time: "3週間前" },
		{ name: "IT事業部", time: "2022年10月7日" },
		{ name: "テストタイトル3", time: "2022年4月21日" },
		{ name: "開発・ツール関連打ち合わせ2", time: "2022年4月21日" },
	];

	const events = {
		description:
			"ホームから今後のイベントを確認し、ミーティングに参加できます。",
		linkText: "Googleカレンダーを接続",
		schedules: [
			{ date: "今日 7月3日", name: "最初の会議 9:00 - オフィス" },
			{ date: "木 7月4日", name: "ランチ 13:00 - レストラン" },
			{ date: "木 7月4日", name: "食料品の買い出し 11:00 - 店" },
		],
	};

	const tasks = {
		description:
			"あなたに割り当てられたすべてのタスクを一か所で表示します。",
		linkText: "タスクが表示されませんか？",
		taskList: [
			{ name: "状況確認", date: "2024年7月3日", type: "仕事" },
			{
				name: "デザインドキュメントをレビュー",
				date: "2024年7月4日",
				type: "仕事",
			},
			{
				name: "カラーパレットを作成",
				date: "2024年7月10日",
				type: "仕事",
			},
			{
				name: "ニューヨーク行きのフライトを予約",
				date: "2024年7月3日",
				type: "個人",
			},
			{ name: "アズマさんと会食", date: "2024年7月10日", type: "個人" },
		],
	};

	return (
		<div className="min-h-screen bg-gray-800 flex flex-col">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<AuthLayout />}>
						<Route path="login" element={<Login />} />
						<Route path="register" element={<Register />} />
					</Route>
					<Route path="/" element={<AppLayout />}>
						<Route
							index
							element={
								<Home
									title={"ホーム"}
									recentAccess={recentAccess}
									events={events}
									tasks={tasks}
								/>
							}
						/>
						<Route path="kanban/" element={<Kanban />} />
						<Route
							path="kanban/:id"
							element={<KanbanBoard height={""} />}
						/>
						<Route path="note/:id" element={<Note />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;

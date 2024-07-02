// import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./components/layout/AuthLayout";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import AppLayout from "./components/layout/AppLayout";
import Home from "./components/pages/Home";
import Memo from "./components/pages/Memo";
import { useEffect } from "react";

function App() {
	useEffect(() => {
		// システムの設定に基づいて dark モードを適用
		if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, []);

	const recentAccess = [
		{ name: "無題", time: "9分前" },
		{ name: "データ取込（案）", time: "2022年5月26日" },
		{ name: "テスト", time: "2022年4月21日" },
		{ name: "開発・ツール関連", time: "2023年9月5日" },
		{ name: "無題", time: "3週間前" },
		{ name: "FC事業部", time: "2022年10月7日" },
		{ name: "データ取込（看板）", time: "16分前" },
		{ name: "無題", time: "3週間前" },
		{ name: "データ取込（案）", time: "2022年5月26日" },
		{ name: "テスト", time: "2022年4月21日" },
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
			"はたいや未内であなたに割り当てられたすべてのタスクを一か所で表示します。",
		linkText: "タスクが表示されませんか？",
		taskList: [
			{ name: "ゴトウさん状況確認", date: "2024年7月3日", type: "仕事" },
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
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
					</Route>
					<Route path="/" element={<AppLayout />}>
						<Route
							path="memo"
							element={
								<Home
									title={"ホーム"}
									recentAccess={recentAccess}
									events={events}
									tasks={tasks}
								/>
							}
						/>
						{/* <Route path="memo" element={<Home />} /> */}
						<Route path="memo/:id" element={<Memo />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;

import React, { useEffect, useState } from "react";
import kanbanApi from "../../api/kanbanApi";
import { KanbanBoard } from "../Kanban/KanbanBoard";
import { Kanban } from "../../types/kanban";
import { AxiosResponse } from "axios";

const HomeKanban: React.FC = () => {
	const [mainKanban, setMainKanban] = useState<Kanban[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchMainKanban = async () => {
		try {
			setLoading(true);
			const response: AxiosResponse<Kanban[]> =
				await kanbanApi.getMainKanban();
			if (response.data.length > 0) setMainKanban(response.data);
		} catch (err) {
			console.log("kanban data not found");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMainKanban();
	}, []);

	const handleCreateKanban = async () => {
		try {
			setLoading(true);
			await kanbanApi.create({
				title: "カンバンボード",
				main: true,
			});
			// 作成後に即座にメインカンバンを再取得
			await fetchMainKanban();
		} catch (err: any) {
			setError(err.message || "Failed to create Kanban");
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div className="flex flex-col h-full">
			<h1 className="text-2xl font-bold mb-4">カンバンボード</h1>
			{mainKanban ? (
				<KanbanBoard kanbanId={mainKanban[0].id} />
			) : (
				<div className="flex flex-col items-center justify-center h-full">
					<p className="mb-4">
						カンバンボードでは、タスクを視覚的に管理し、ドラッグ＆ドロップで簡単に進捗を更新できます。
					</p>
					<button
						onClick={handleCreateKanban}
						className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
					>
						カンバンボードを作成
					</button>
				</div>
			)}
		</div>
	);
};

export default HomeKanban;

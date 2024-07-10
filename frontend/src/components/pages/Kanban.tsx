import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import kanbanApi from "../../api/kanbanApi";
import { KanbanColumn } from "../../types/kanban";
import { v4 as uuidv4 } from "uuid";

const Kanban: React.FC = () => {
	const navigate = useNavigate();
	// const { id } = useParams(); // URLからメモIDを取得
	// const [kanban, setKanban] = useState<KanbanType | null>(null);
	// const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// useEffect(() => {
	// 	const fetchMainKanban = async () => {
	// 		try {
	// 			setLoading(true);
	// 			if (id) {
	// 				const response = await kanbanApi.getKanban(id);
	// 				setKanban(response.data);
	// 			} else {
	// 				const response = await kanbanApi.getMainKanban();
	// 				setKanban(response.data);
	// 			}
	// 		} catch (err) {
	// 			console.log("Failed to fetch Kanban:", err);
	// 		} finally {
	// 			setLoading(false);
	// 		}
	// 	};

	// 	fetchMainKanban();
	// }, [id]);

	const handleCreateKanban = async () => {
		const columns: KanbanColumn[] = [
			{ id: uuidv4(), title: "未着手", cards: [] },
			{ id: uuidv4(), title: "進行中", cards: [] },
			{ id: uuidv4(), title: "完了", cards: [] },
		];

		try {
			const res = await kanbanApi.create({
				title: "新しいカンバン",
				columns: columns,
			});

			navigate(`/kanban/${res.data.id}`);
		} catch (err: any) {
			setError(err.message || "Failed to create Kanban");
		}
	};

	if (error) return <div>Error: {error}</div>;

	return (
		<div className="flex flex-col h-full">
			{/* {kanban ? (
				<KanbanBoard initialKanban={kanban} height="h-full" />
			) : ( */}
			<div className="flex flex-col items-center justify-center h-full">
				<p className="dark:text-white text-center text-lg mb-4">
					カンバンボードでは、タスクを視覚的に管理し、ドラッグ＆ドロップで簡単に進捗を更新できます。
				</p>
				<button
					onClick={handleCreateKanban}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					カンバンボードを作成
				</button>
			</div>
			{/* )} */}
		</div>
	);
};

export default Kanban;

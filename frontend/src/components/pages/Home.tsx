import React from "react";
import DashboardTitle from "../dashboard/DashboardTitle";
import RecentAccess from "../dashboard/RecentAccess";
import WeeklyEvents from "../dashboard/WeeklyEvents";
import MyTasks from "../dashboard/MyTasks";
import { KanbanBoard } from "../Kanban/KanbanBoard";
import { Column } from "../../types/kanban";

interface HomeProps {
	kanbanData: {
		columns: Array<{
			id: string;
			title: string;
			cards: Array<{ id: string; title: string }>;
		}>;
	};
	title: string;
	recentAccess: Array<{ name: string; time: string }>;
	events: {
		description: string;
		linkText: string;
		schedules: Array<{ date: string; name: string }>;
	};
	tasks: {
		description: string;
		linkText: string;
		taskList: Array<{ name: string; date: string; type: string }>;
	};
}

const Home: React.FC<HomeProps> = ({ title, events, tasks }) => {
	const kanbanData: Column[] = [
		{
			id: "column-1",
			title: "未着手",
			cards: [
				{ id: "card-1", title: "カード1" },
				{ id: "card-2", title: "カード2" },
				{ id: "card-3", title: "カード3" },
			],
		},
		{
			id: "column-2",
			title: "進行中",
			cards: [],
		},
		{
			id: "column-3",
			title: "完了",
			cards: [],
		},
	];
	return (
		<div className="dark:bg-gray-800 min-h-screen p-6">
			<DashboardTitle title={title} />
			<KanbanBoard initialColumns={kanbanData} />
			<RecentAccess />
			<WeeklyEvents events={events} />
			<MyTasks tasks={tasks} />
		</div>
	);
};

export default Home;

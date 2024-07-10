import React from "react";
import DashboardTitle from "../dashboard/DashboardTitle";
import RecentAccess from "../dashboard/RecentAccess";
import WeeklyEvents from "../dashboard/WeeklyEvents";
import MyTasks from "../dashboard/MyTasks";
<<<<<<< HEAD
// import { KanbanBoard } from "../Kanban/KanbanBoard";

=======
>>>>>>> 32d9c58 (カンバン機能の立て直し、設計と実装をすべてやり直した。残りは永続化のみ)
interface HomeProps {
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
	return (
		<div className="dark:bg-gray-800 min-h-screen p-6">
			<DashboardTitle title={title} />
<<<<<<< HEAD
			{/* <KanbanBoard />	 */}
=======
>>>>>>> 32d9c58 (カンバン機能の立て直し、設計と実装をすべてやり直した。残りは永続化のみ)
			<RecentAccess />
			<WeeklyEvents events={events} />
			<MyTasks tasks={tasks} />
		</div>
	);
};

export default Home;

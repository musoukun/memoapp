import React from "react";
import DashboardTitle from "../dashboard/DashboardTitle";
import RecentAccess from "../dashboard/RecentAccess";
import WeeklyEvents from "../dashboard/WeeklyEvents";
import MyTasks from "../dashboard/MyTasks";

interface MainDashboardProps {
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

const MainDashboard: React.FC<MainDashboardProps> = ({
	title,
	recentAccess,
	events,
	tasks,
}) => {
	return (
		<div className="dark:bg-gray-800 min-h-screen p-6">
			<DashboardTitle title={title} />
			<RecentAccess recentAccess={recentAccess} />
			<WeeklyEvents events={events} />
			<MyTasks tasks={tasks} />
		</div>
	);
};

export default MainDashboard;
